package com.gabrieudev.regexbuilder.domain.port;

public interface PasswordEncoderPort {
    String encode(CharSequence rawPassword);

    boolean matches(CharSequence rawPassword, String encodedPassword);
}