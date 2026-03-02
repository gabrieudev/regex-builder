package com.gabrieudev.regexbuilder.infrastructure.executor;

import com.gabrieudev.regexbuilder.application.dto.regex.RegexRequest;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Component
public class PythonRegexExecutor extends AbstractExternalProcessExecutor {

    @Override
    protected ProcessBuilder buildProcess(RegexRequest request, Path workingDir) throws IOException {
        Path scriptFile = createTempScript("scripts/python/regex_runner.py", "regex_runner.py", workingDir);
        List<String> command = new ArrayList<>();
        command.add("python3");
        command.add(scriptFile.toString());

        ProcessBuilder pb = new ProcessBuilder(command);
        pb.directory(workingDir.toFile());
        pb.environment().clear();
        pb.environment().put("PATTERN", request.getPattern());
        pb.environment().put("TEST_STRING", request.getTestString() == null ? "" : request.getTestString());
        return pb;
    }
}