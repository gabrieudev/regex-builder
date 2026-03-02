package com.gabrieudev.regexbuilder.infrastructure.executor;

import com.gabrieudev.regexbuilder.application.dto.regex.RegexRequest;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexResponse;

public interface RegexExecutorStrategy {
    RegexResponse execute(RegexRequest request);
}