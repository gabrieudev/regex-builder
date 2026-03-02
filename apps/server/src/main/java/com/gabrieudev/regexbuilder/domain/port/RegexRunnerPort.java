package com.gabrieudev.regexbuilder.domain.port;

import com.gabrieudev.regexbuilder.application.dto.regex.RegexRequest;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexResponse;

public interface RegexRunnerPort {
    RegexResponse executeRegex(RegexRequest request);
}
