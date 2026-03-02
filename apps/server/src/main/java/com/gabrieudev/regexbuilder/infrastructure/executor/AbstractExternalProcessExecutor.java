package com.gabrieudev.regexbuilder.infrastructure.executor;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexRequest;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

public abstract class AbstractExternalProcessExecutor implements RegexExecutorStrategy {

    protected final Logger log = LoggerFactory.getLogger(getClass());
    protected final ObjectMapper objectMapper = new ObjectMapper();

    protected static final long TIMEOUT_SECONDS = 3;

    @Override
    public RegexResponse execute(RegexRequest request) {
        long startTime = System.currentTimeMillis();
        RegexResponse response = createEmptyResponse();

        final AtomicReference<Process> processRef = new AtomicReference<>();
        Path tempDir = null;

        try {
            tempDir = Files.createTempDirectory("regex-exec");
            ProcessBuilder processBuilder = buildProcess(request, tempDir);
            processBuilder.redirectErrorStream(true);
            processRef.set(processBuilder.start());

            StringBuilder output = new StringBuilder();
            Thread readerThread = new Thread(() -> {
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(processRef.get().getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        output.append(line).append("\n");
                    }
                } catch (IOException ignored) {
                }
            });
            readerThread.start();

            Process proc = processRef.get();
            boolean finished = proc.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);
            readerThread.join(1000);

            if (!finished) {
                proc.destroyForcibly();
                log.warn("Tempo limite excedido ao executar regex: pattern={}", request.getPattern());
                response.setSuccess(false);
                response.setError("Tempo limite de execução excedido (> " + TIMEOUT_SECONDS + "s)");
                response.setExecutionTimeMs(System.currentTimeMillis() - startTime);
                return response;
            }

            int exitCode = proc.exitValue();
            String outputStr = output.toString().trim();

            if (exitCode == 0 && !outputStr.isEmpty()) {
                parseOutput(outputStr, response, startTime);
            } else {
                String errorMsg = outputStr.isEmpty() ? "Processo encerrado com código " + exitCode : outputStr;
                log.warn("Erro no subprocesso de regex: {}", errorMsg);
                response.setSuccess(false);
                response.setError("Falha na execução da regex");
                response.setExecutionTimeMs(System.currentTimeMillis() - startTime);
            }

        } catch (Exception e) {
            log.error("Exceção durante execução da regex", e);
            response.setSuccess(false);
            response.setError("Erro interno do servidor");
            response.setExecutionTimeMs(System.currentTimeMillis() - startTime);
        } finally {
            cleanup(processRef.get(), tempDir);
        }

        return response;
    }

    protected abstract ProcessBuilder buildProcess(RegexRequest request, Path workingDir) throws IOException;

    protected Path createTempScript(String resourcePath, String scriptName, Path workingDir) throws IOException {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream(resourcePath)) {
            if (is == null) {
                throw new FileNotFoundException("Script não encontrado: " + resourcePath);
            }
            byte[] scriptBytes = is.readAllBytes();
            String suffix = scriptName.substring(scriptName.lastIndexOf('.'));
            Path tempFile = Files.createTempFile(workingDir, "regex-runner-", suffix);
            Files.write(tempFile, scriptBytes);
            return tempFile;
        }
    }

    private RegexResponse createEmptyResponse() {
        RegexResponse response = new RegexResponse();
        response.setSuccess(false);
        response.setMatches(new ArrayList<>());
        response.setMatchRanges(new ArrayList<>());
        response.setGroups(new ArrayList<>());
        response.setNamedGroups(new HashMap<>());
        response.setWarnings(new ArrayList<>());
        return response;
    }

    private void parseOutput(String outputStr, RegexResponse response, long startTime) {
        try {
            Map<String, Object> result = objectMapper.readValue(outputStr,
                    new TypeReference<Map<String, Object>>() {
                    });

            response.setSuccess(asBoolean(result.get("success"), false));
            response.setMatches(asList(result.get("matches")));
            response.setMatchCount(asInteger(result.get("matchCount"), 0));
            response.setMatchRanges(convertMatchRanges(result.get("matchRanges")));
            response.setGroups(convertNestedLists(result.get("groups")));
            response.setNamedGroups(convertMapOfLists(result.get("namedGroups")));
            response.setWarnings(asList(result.get("warnings")));
            response.setIsFullMatch(asBoolean(result.get("isFullMatch"), false));

            Long execTime = asLong(result.get("executionTimeMs"), null);
            response.setExecutionTimeMs(execTime != null ? execTime : System.currentTimeMillis() - startTime);

            if (!response.isSuccess()) {
                String error = result.containsKey("error") ? result.get("error").toString() : "Erro desconhecido";
                response.setError(error);
                log.warn("Execução de regex falhou internamente: {}", error);
            }
        } catch (Exception e) {
            log.error("Falha ao analisar saída do script", e);
            response.setSuccess(false);
            response.setError("Erro interno ao processar resultado da regex");
            response.setExecutionTimeMs(System.currentTimeMillis() - startTime);
        }
    }

    private void cleanup(Process proc, Path tempDir) {
        if (proc != null && proc.isAlive()) {
            proc.destroyForcibly();
        }
        if (tempDir != null) {
            try {
                Files.walk(tempDir)
                        .sorted(Comparator.reverseOrder())
                        .forEach(path -> {
                            try {
                                Files.deleteIfExists(path);
                            } catch (IOException ignored) {
                            }
                        });
            } catch (IOException ignored) {
            }
        }
    }

    // Métodos auxiliares de conversão
    protected boolean asBoolean(Object value, boolean defaultValue) {
        if (value instanceof Boolean)
            return (Boolean) value;
        if (value instanceof String)
            return Boolean.parseBoolean((String) value);
        return defaultValue;
    }

    protected int asInteger(Object value, int defaultValue) {
        if (value instanceof Number)
            return ((Number) value).intValue();
        if (value instanceof String) {
            try {
                return Integer.parseInt((String) value);
            } catch (NumberFormatException ignored) {
            }
        }
        return defaultValue;
    }

    protected Long asLong(Object value, Long defaultValue) {
        if (value instanceof Number)
            return ((Number) value).longValue();
        if (value instanceof String) {
            try {
                return Long.parseLong((String) value);
            } catch (NumberFormatException ignored) {
            }
        }
        return defaultValue;
    }

    protected List<String> asList(Object value) {
        if (value == null)
            return new ArrayList<>();
        try {
            return objectMapper.convertValue(value, new TypeReference<List<String>>() {
            });
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    protected List<Map<String, Integer>> convertMatchRanges(Object value) {
        if (value == null)
            return new ArrayList<>();
        try {
            return objectMapper.convertValue(value, new TypeReference<List<Map<String, Integer>>>() {
            });
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    protected List<List<String>> convertNestedLists(Object value) {
        if (value == null)
            return new ArrayList<>();
        try {
            return objectMapper.convertValue(value, new TypeReference<List<List<String>>>() {
            });
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    protected Map<String, List<String>> convertMapOfLists(Object value) {
        if (value == null)
            return new HashMap<>();
        try {
            return objectMapper.convertValue(value, new TypeReference<Map<String, List<String>>>() {
            });
        } catch (Exception e) {
            return new HashMap<>();
        }
    }
}