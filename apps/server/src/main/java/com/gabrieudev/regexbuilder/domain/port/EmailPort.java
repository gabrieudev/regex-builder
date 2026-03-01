package com.gabrieudev.regexbuilder.domain.port;

import com.gabrieudev.regexbuilder.domain.model.EmailOptions;

public interface EmailPort {
    boolean sendVerificationEmail(EmailOptions options);

    boolean sendResetPasswordEmail(EmailOptions options);
}
