package com.gabrieudev.regexbuilder.application.usecase.regex;

import org.springframework.stereotype.Service;

import com.gabrieudev.regexbuilder.application.dto.regex.ExecuteRegexRequest;
import com.gabrieudev.regexbuilder.application.dto.regex.ExecuteRegexResponse;
import com.gabrieudev.regexbuilder.domain.port.ExecuteRegexPort;

@Service
public class ExecuteRegexUseCase {
    private final ExecuteRegexPort regexRunnerPort;

    public ExecuteRegexUseCase(ExecuteRegexPort regexRunnerPort) {
        this.regexRunnerPort = regexRunnerPort;
    }

    public ExecuteRegexResponse execute(ExecuteRegexRequest request) {
        return regexRunnerPort.executeRegex(request);
    }
}