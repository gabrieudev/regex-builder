package com.gabrieudev.regexbuilder.infrastructure.executor;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexRequest;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.*;

@Component
public class JavaRegexExecutor implements RegexExecutorStrategy {

    private static final Logger log = LoggerFactory.getLogger(JavaRegexExecutor.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final int MAX_MATCHES = 1000;
    private static final int MAX_MATCH_LENGTH = 10_000;
    private static final long JAVA_REGEX_TIMEOUT_MS = 2000;

    @Override
    public RegexResponse execute(RegexRequest request) {
        long startNano = System.nanoTime();
        Map<String, Object> detailed = new HashMap<>();
        detailed.put("engine", "java");
        detailed.put("pattern", request.getPattern());

        ExecutorService executor = Executors.newSingleThreadExecutor();
        Future<?> future = null;

        try {
            final String pattern = request.getPattern();
            final String testString = request.getTestString() == null ? "" : request.getTestString();

            future = executor.submit(() -> {
                try {
                    java.util.regex.Pattern compiled = java.util.regex.Pattern.compile(pattern);
                    java.util.regex.Matcher matcher = compiled.matcher(testString);

                    List<String> matches = new ArrayList<>();
                    List<Map<String, Integer>> matchRanges = new ArrayList<>();
                    List<List<String>> groupsList = new ArrayList<>();
                    Map<String, List<String>> namedGroups = new HashMap<>();

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
                                detailed.put("warnings", List.of("Máximo de matches truncado para " + MAX_MATCHES));
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

            future.get(JAVA_REGEX_TIMEOUT_MS, TimeUnit.MILLISECONDS);

        } catch (TimeoutException te) {
            log.warn("Tempo limite da regex Java excedido: pattern={}", request.getPattern());
            detailed.put("success", false);
            detailed.put("error", "Tempo limite excedido ao executar regex após " + JAVA_REGEX_TIMEOUT_MS + "ms");
            if (future != null)
                future.cancel(true);
        } catch (ExecutionException ee) {
            log.error("Erro na execução da regex Java", ee);
            detailed.put("success", false);
            detailed.put("error", "Erro na execução");
        } catch (Exception ex) {
            log.error("Erro inesperado na regex Java", ex);
            detailed.put("success", false);
            detailed.put("error", "Erro interno");
        } finally {
            executor.shutdownNow();
            long elapsedMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startNano);
            detailed.put("executionTimeMs", elapsedMs);
        }

        return buildResponse(detailed);
    }

    private RegexResponse buildResponse(Map<String, Object> detailed) {
        RegexResponse resp = new RegexResponse();
        resp.setSuccess(asBoolean(detailed.get("success"), false));
        resp.setMatches(asList(detailed.get("matches")));
        resp.setError(detailed.containsKey("error") ? detailed.get("error").toString() : null);
        resp.setExecutionTimeMs(asLong(detailed.get("executionTimeMs"), 0L));
        resp.setMatchCount(asInteger(detailed.get("matchCount"), 0));
        resp.setMatchRanges(convertMatchRanges(detailed.get("matchRanges")));
        resp.setGroups(convertNestedLists(detailed.get("groups")));
        resp.setNamedGroups(convertMapOfLists(detailed.get("namedGroups")));
        resp.setIsFullMatch(asBoolean(detailed.get("isFullMatch"), false));
        resp.setWarnings(asList(detailed.get("warnings")));
        return resp;
    }

    // Métodos auxiliares de conversão
    private boolean asBoolean(Object value, boolean defaultValue) {
        if (value instanceof Boolean)
            return (Boolean) value;
        if (value instanceof String)
            return Boolean.parseBoolean((String) value);
        return defaultValue;
    }

    private int asInteger(Object value, int defaultValue) {
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

    private Long asLong(Object value, Long defaultValue) {
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

    private List<String> asList(Object value) {
        if (value == null)
            return new ArrayList<>();
        try {
            return objectMapper.convertValue(value, new TypeReference<List<String>>() {
            });
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private List<Map<String, Integer>> convertMatchRanges(Object value) {
        if (value == null)
            return new ArrayList<>();
        try {
            return objectMapper.convertValue(value, new TypeReference<List<Map<String, Integer>>>() {
            });
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private List<List<String>> convertNestedLists(Object value) {
        if (value == null)
            return new ArrayList<>();
        try {
            return objectMapper.convertValue(value, new TypeReference<List<List<String>>>() {
            });
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private Map<String, List<String>> convertMapOfLists(Object value) {
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