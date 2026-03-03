package com.gabrieudev.regexbuilder.infrastructure.executor;

import org.springframework.stereotype.Component;

import com.gabrieudev.regexbuilder.application.dto.regex.ExecuteRegexRequest;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Component
public class JavaScriptRegexExecutor extends AbstractExternalProcessExecutor {

    @Override
    protected ProcessBuilder buildProcess(ExecuteRegexRequest request, Path workingDir) throws IOException {
        Path scriptFile = createTempScript("scripts/javascript/regex-runner.js", "regex-runner.js", workingDir);
        List<String> command = new ArrayList<>();
        command.add("node");
        command.add(scriptFile.toString());

        ProcessBuilder pb = new ProcessBuilder(command);
        pb.directory(workingDir.toFile());
        pb.environment().clear();
        pb.environment().put("PATTERN", request.getPattern());
        pb.environment().put("TEST_STRING", request.getTestString() == null ? "" : request.getTestString());
        return pb;
    }
}