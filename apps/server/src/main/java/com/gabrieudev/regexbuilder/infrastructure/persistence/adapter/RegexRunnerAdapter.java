package com.gabrieudev.regexbuilder.infrastructure.persistence.adapter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Component;

import com.gabrieudev.regexbuilder.application.dto.regex.RegexRequest;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexResponse;
import com.gabrieudev.regexbuilder.domain.port.RegexRunnerPort;
import com.gabrieudev.regexbuilder.infrastructure.executor.JavaRegexExecutor;
import com.gabrieudev.regexbuilder.infrastructure.executor.JavaScriptRegexExecutor;
import com.gabrieudev.regexbuilder.infrastructure.executor.PythonRegexExecutor;
import com.gabrieudev.regexbuilder.infrastructure.executor.RegexExecutorStrategy;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class RegexRunnerAdapter implements RegexRunnerPort {

    private static final int MAX_CONCURRENT_EXECUTIONS = 5;
    private static final long SEMAPHORE_TIMEOUT_SECONDS = 2;

    private final Semaphore executionSemaphore = new Semaphore(MAX_CONCURRENT_EXECUTIONS);
    private final Map<String, RegexExecutorStrategy> strategies = new ConcurrentHashMap<>();

    public RegexRunnerAdapter(JavaRegexExecutor javaExecutor,
            JavaScriptRegexExecutor jsExecutor,
            PythonRegexExecutor pythonExecutor) {
        strategies.put("java", javaExecutor);
        strategies.put("javascript", jsExecutor);
        strategies.put("python", pythonExecutor);
    }

    @Override
    public RegexResponse executeRegex(RegexRequest request) {

        // Controle de concorrência
        try {
            if (!executionSemaphore.tryAcquire(SEMAPHORE_TIMEOUT_SECONDS, TimeUnit.SECONDS)) {
                log.warn("Muitas execuções simultâneas de regex, rejeitando requisição");
                RegexResponse errorResponse = new RegexResponse();
                errorResponse.setSuccess(false);
                errorResponse.setError("Servidor ocupado, tente novamente mais tarde");
                errorResponse.setExecutionTimeMs(0L);
                return errorResponse;
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            RegexResponse errorResponse = new RegexResponse();
            errorResponse.setSuccess(false);
            errorResponse.setError("Interrompido");
            return errorResponse;
        }

        try {
            String language = request.getLanguage().name().toLowerCase();
            RegexExecutorStrategy strategy = strategies.get(language);
            if (strategy == null) {
                throw new IllegalArgumentException("Linguagem não suportada: " + language);
            }
            return strategy.execute(request);
        } finally {
            executionSemaphore.release();
        }
    }
}