package com.gabrieudev.regexbuilder.infrastructure.persistence.adapter;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexRequest;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexResponse;
import com.gabrieudev.regexbuilder.domain.port.RegexRunnerPort;

@Component
public class RegexRunnerAdapter implements RegexRunnerPort {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final int MAX_MATCHES = 1000;
    private static final int MAX_MATCH_LENGTH = 10_000;
    private static final long JAVA_REGEX_TIMEOUT_MS = 2000;

    @Override
    public RegexResponse executeRegex(RegexRequest request) {

        if (request.getLanguage().name().equalsIgnoreCase("java")) {
            return executeJavaInProcess(request);
        }

        long startTime = System.currentTimeMillis();
        RegexResponse response = new RegexResponse();

        final AtomicReference<Process> processRef = new AtomicReference<>();
        Path tempFile = null;

        try {
            ProcessBuilder processBuilder = buildProcess(request);
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
            boolean finished = proc.waitFor(10, TimeUnit.SECONDS);
            readerThread.join(1000);

            if (!finished) {
                proc.destroyForcibly();
                throw new RuntimeException("Timeout executing regex");
            }

            int exitCode = proc.exitValue();
            String outputStr = output.toString().trim();

            if (exitCode == 0 && !outputStr.isEmpty()) {
                try {
                    Map<String, Object> result = objectMapper.readValue(outputStr,
                            new TypeReference<Map<String, Object>>() {
                            });
                    response.setSuccess(true);
                    Object matchesObj = result.get("matches");
                    List<String> matches = new ArrayList<>();
                    if (matchesObj != null) {
                        try {
                            matches = objectMapper.convertValue(matchesObj, new TypeReference<List<String>>() {
                            });
                        } catch (IllegalArgumentException ex) {
                            List<Object> rawMatches = objectMapper.convertValue(matchesObj,
                                    new TypeReference<List<Object>>() {
                                    });
                            for (Object item : rawMatches) {
                                matches.add(item.toString());
                            }
                        }
                    }
                    response.setMatches(matches);
                    response.setMatches(convertList(result.get("matches"), String.class));
                    response.setMatchCount(convertValue(result.get("matchCount"), Integer.class));
                    response.setMatchRanges(convertListOfMaps(result.get("matchRanges")));
                    response.setGroups(convertNestedLists(result.get("groups")));
                    response.setNamedGroups(convertMapOfLists(result.get("namedGroups")));
                    response.setWarnings(convertList(result.get("warnings"), String.class));
                    response.setIsFullMatch(convertValue(result.get("isFullMatch"), Boolean.class));
                    response.setExecutionTimeMs(convertValue(result.get("executionTimeMs"), Long.class));
                } catch (Exception e) {
                    response.setSuccess(false);
                    response.setError("Failed to parse output: " + e.getMessage() + "\nOutput: " + outputStr);
                }
            } else {
                response.setSuccess(false);
                response.setError(outputStr.isEmpty() ? "Process exited with code " + exitCode : outputStr);
            }

        } catch (Exception e) {
            response.setSuccess(false);
        } finally {
            Process proc = processRef.get();
            if (proc != null && proc.isAlive()) {
                proc.destroyForcibly();
            }
            if (tempFile != null) {
                try {
                    Files.deleteIfExists(tempFile);
                } catch (IOException ignored) {
                }
            }
            response.setExecutionTimeMs(System.currentTimeMillis() - startTime);
        }

        return response;
    }

    private <T> T convertValue(Object value, Class<T> clazz) {
        return value == null ? null : objectMapper.convertValue(value, clazz);
    }

    private List<String> convertList(Object value, Class<String> elementClass) {
        if (value == null)
            return new ArrayList<>();
        return objectMapper.convertValue(value, new TypeReference<List<String>>() {
        });
    }

    private List<Map<String, Integer>> convertListOfMaps(Object value) {
        if (value == null)
            return new ArrayList<>();
        return objectMapper.convertValue(value, new TypeReference<List<Map<String, Integer>>>() {
        });
    }

    private List<List<String>> convertNestedLists(Object value) {
        if (value == null)
            return new ArrayList<>();
        return objectMapper.convertValue(value, new TypeReference<List<List<String>>>() {
        });
    }

    private Map<String, List<String>> convertMapOfLists(Object value) {
        if (value == null)
            return new java.util.HashMap<>();
        return objectMapper.convertValue(value, new TypeReference<Map<String, List<String>>>() {
        });
    }

    private RegexResponse executeJavaInProcess(RegexRequest request) {
        long startNano = System.nanoTime();

        var detailed = new java.util.HashMap<String, Object>();
        detailed.put("engine", "java");
        detailed.put("pattern", request.getPattern());

        java.util.concurrent.ExecutorService executor = java.util.concurrent.Executors.newSingleThreadExecutor();
        java.util.concurrent.Future<?> future = null;

        try {
            final String pattern = request.getPattern();
            final String testString = request.getTestString() == null ? "" : request.getTestString();

            future = executor.submit(() -> {
                try {
                    java.util.regex.Pattern compiled = java.util.regex.Pattern.compile(pattern);
                    java.util.regex.Matcher matcher = compiled.matcher(testString);

                    java.util.List<String> matches = new ArrayList<>();
                    java.util.List<Map<String, Object>> matchRanges = new ArrayList<>();
                    java.util.List<List<String>> groupsList = new ArrayList<>();
                    java.util.Map<String, List<String>> namedGroups = new java.util.HashMap<>();

                    boolean anyFullMatch = false;
                    if (matcher.matches()) {
                        anyFullMatch = true;
                        String m = matcher.group();
                        if (m.length() > MAX_MATCH_LENGTH)
                            m = m.substring(0, MAX_MATCH_LENGTH);
                        matches.add(m);
                        matchRanges.add(Map.of("start", matcher.start(), "end", matcher.end()));
                        List<String> gr = new ArrayList<>();
                        for (int i = 0; i <= matcher.groupCount(); i++) {
                            String g = matcher.group(i);
                            gr.add(g == null ? null
                                    : (g.length() > MAX_MATCH_LENGTH ? g.substring(0, MAX_MATCH_LENGTH) : g));
                        }
                        groupsList.add(gr);
                    } else {
                        matcher.reset();
                        int count = 0;
                        while (matcher.find()) {
                            if (count >= MAX_MATCHES) {
                                detailed.put("warnings", java.util.List.of("maxMatches truncated to " + MAX_MATCHES));
                                break;
                            }
                            String m = matcher.group();
                            if (m == null)
                                m = "";
                            if (m.length() > MAX_MATCH_LENGTH)
                                m = m.substring(0, MAX_MATCH_LENGTH);
                            matches.add(m);
                            matchRanges.add(Map.of("start", matcher.start(), "end", matcher.end()));

                            List<String> gr = new ArrayList<>();
                            for (int i = 0; i <= matcher.groupCount(); i++) {
                                String g = null;
                                try {
                                    g = matcher.group(i);
                                } catch (Exception ignored) {
                                }
                                gr.add(g == null ? null
                                        : (g.length() > MAX_MATCH_LENGTH ? g.substring(0, MAX_MATCH_LENGTH) : g));
                            }
                            groupsList.add(gr);
                            count++;
                        }
                    }

                    detailed.put("success", true);
                    detailed.put("matches", matches);
                    detailed.put("matchCount", matches.size());
                    detailed.put("matchRanges", matchRanges);
                    detailed.put("groups", groupsList);
                    detailed.put("namedGroups", namedGroups);
                    detailed.put("isFullMatch", anyFullMatch);
                } catch (Throwable t) {
                    detailed.put("success", false);
                    detailed.put("error", t.toString());
                }
            });

            future.get(JAVA_REGEX_TIMEOUT_MS, java.util.concurrent.TimeUnit.MILLISECONDS);

        } catch (java.util.concurrent.TimeoutException te) {
            detailed.put("success", false);
            detailed.put("error", "Timeout executing regex (java) after " + JAVA_REGEX_TIMEOUT_MS + "ms");
            if (future != null)
                future.cancel(true);
        } catch (java.util.concurrent.ExecutionException ee) {
            detailed.put("success", false);
            detailed.put("error", "Execution error: " + ee.getCause());
        } catch (Exception ex) {
            detailed.put("success", false);
            detailed.put("error", ex.toString());
        } finally {
            executor.shutdownNow();
            long elapsedMs = java.util.concurrent.TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startNano);
            detailed.put("executionTimeMs", elapsedMs);
        }

        RegexResponse resp = new RegexResponse();
        resp.setSuccess(Boolean.TRUE.equals(detailed.get("success")));
        Object matchesObj = detailed.get("matches");
        if (matchesObj instanceof java.util.List) {
            @SuppressWarnings("unchecked")
            java.util.List<String> matches = (java.util.List<String>) matchesObj;
            resp.setMatches(matches);
        } else {
            resp.setMatches(new ArrayList<>());
        }
        resp.setError(detailed.containsKey("error") ? String.valueOf(detailed.get("error")) : null);
        resp.setExecutionTimeMs(((Number) detailed.getOrDefault("executionTimeMs", 0)).longValue());

        resp.setMatchCount(((Number) detailed.getOrDefault("matchCount", 0)).intValue());
        resp.setMatchRanges((List<Map<String, Integer>>) detailed.getOrDefault("matchRanges", List.of()));
        resp.setGroups((List<List<String>>) detailed.getOrDefault("groups", List.of()));
        resp.setNamedGroups((Map<String, List<String>>) detailed.getOrDefault("namedGroups", Map.of()));
        resp.setIsFullMatch((Boolean) detailed.getOrDefault("isFullMatch", false));
        resp.setWarnings((List<String>) detailed.getOrDefault("warnings", List.of()));
        resp.setMeta((Map<String, Object>) detailed.getOrDefault("meta", Map.of()));

        return resp;
    }

    private ProcessBuilder buildProcess(RegexRequest request) throws IOException {
        List<String> command = new ArrayList<>();
        String language = request.getLanguage().name().toLowerCase();

        switch (language) {
            case "javascript":
                command.add("node");
                Path jsFile = createTempScript("javascript", "regex-runner.js");
                command.add(jsFile.toString());
                break;
            case "python":
                command.add("python3");
                Path pyFile = createTempScript("python", "regex_runner.py");
                command.add(pyFile.toString());
                break;
            default:
                throw new IllegalArgumentException("Unsupported language: " + language);
        }

        ProcessBuilder pb = new ProcessBuilder(command);
        pb.environment().put("PATTERN", request.getPattern());
        pb.environment().put("TEST_STRING", request.getTestString());

        return pb;
    }

    private Path createTempScript(String languageDir, String scriptName) throws IOException {
        String resourcePath = "scripts/" + languageDir + "/" + scriptName;
        try (InputStream is = getClass().getClassLoader().getResourceAsStream(resourcePath)) {
            if (is == null) {
                throw new FileNotFoundException("Script not found: " + resourcePath);
            }
            byte[] scriptBytes = is.readAllBytes();

            String suffix = scriptName.substring(scriptName.lastIndexOf('.'));
            Path tempFile = Files.createTempFile("regex-runner-", suffix);
            Files.write(tempFile, scriptBytes);
            tempFile.toFile().deleteOnExit();
            return tempFile;
        }
    }

}
