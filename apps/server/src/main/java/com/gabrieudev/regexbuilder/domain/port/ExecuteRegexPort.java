package com.gabrieudev.regexbuilder.domain.port;

import com.gabrieudev.regexbuilder.application.dto.regex.ExecuteRegexRequest;
import com.gabrieudev.regexbuilder.application.dto.regex.ExecuteRegexResponse;

public interface ExecuteRegexPort {
    ExecuteRegexResponse executeRegex(ExecuteRegexRequest request);
}
