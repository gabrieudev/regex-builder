package com.gabrieudev.regexbuilder.infrastructure.persistence.adapter;

import java.nio.charset.StandardCharsets;
import java.time.Year;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.gabrieudev.regexbuilder.domain.model.EmailOptions;
import com.gabrieudev.regexbuilder.domain.port.EmailPort;

import jakarta.mail.internet.MimeMessage;

@Component
public class EmailAdapter implements EmailPort {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String from;

    public EmailAdapter(JavaMailSender mailSender, SpringTemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Override
    public boolean sendResetPasswordEmail(EmailOptions options) {
        return sendTemplateEmail(
                options,
                "Redefinir sua senha",
                "email/reset-password");
    }

    @Override
    public boolean sendVerificationEmail(EmailOptions options) {
        return sendTemplateEmail(
                options,
                "Confirme seu e-mail",
                "email/verification");
    }

    private String buildPlainText(EmailOptions options, String subject) {

        return """
                %s

                Olá %s,

                Acesse o link abaixo:
                %s

                Se você não solicitou, ignore esta mensagem.

                %s
                """
                .formatted(
                        subject,
                        options.getName(),
                        options.getActionUrl(),
                        options.getCompanyName());
    }

    private boolean sendTemplateEmail(EmailOptions options,
            String subject,
            String templateName) {
        try {

            // ===== Variáveis para o Thymeleaf =====
            Map<String, Object> variables = new HashMap<>();
            variables.put("name", options.getName());
            variables.put("actionUrl", options.getActionUrl());
            variables.put("companyName", options.getCompanyName());
            variables.put("supportEmail", options.getSupportEmail());
            variables.put("year", Year.now().getValue());
            variables.put("subject", subject);

            Context context = new Context();
            context.setVariables(variables);

            String htmlContent = templateEngine.process(templateName, context);

            String plainText = buildPlainText(options, subject);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setFrom(from);
            helper.setTo(options.getTo());
            helper.setSubject(subject);
            helper.setText(plainText, htmlContent);

            mailSender.send(message);

            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
