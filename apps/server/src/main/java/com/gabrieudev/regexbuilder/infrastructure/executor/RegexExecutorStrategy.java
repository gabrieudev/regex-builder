package com.gabrieudev.regexbuilder.infrastructure.executor;

import com.gabrieudev.regexbuilder.application.dto.regex.ExecuteRegexRequest;
import com.gabrieudev.regexbuilder.application.dto.regex.ExecuteRegexResponse;

public interface RegexExecutorStrategy {
    ExecuteRegexResponse execute(ExecuteRegexRequest request);
}