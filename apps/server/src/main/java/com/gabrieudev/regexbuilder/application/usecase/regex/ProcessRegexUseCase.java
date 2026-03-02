package com.gabrieudev.regexbuilder.application.usecase.regex;

import org.springframework.stereotype.Service;

import com.gabrieudev.regexbuilder.application.dto.regex.RegexRequest;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexResponse;
import com.gabrieudev.regexbuilder.domain.port.RegexRunnerPort;

@Service
public class ProcessRegexUseCase {
    private final RegexRunnerPort regexRunnerPort;

    public ProcessRegexUseCase(RegexRunnerPort regexRunnerPort) {
        this.regexRunnerPort = regexRunnerPort;
    }

    public RegexResponse execute(RegexRequest request) {
        return regexRunnerPort.executeRegex(request);
    }
}
