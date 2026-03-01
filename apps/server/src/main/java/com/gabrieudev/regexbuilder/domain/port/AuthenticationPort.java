package com.gabrieudev.regexbuilder.domain.port;

import com.gabrieudev.regexbuilder.domain.model.User;

public interface AuthenticationPort {
    User authenticate(String email, String password);
}