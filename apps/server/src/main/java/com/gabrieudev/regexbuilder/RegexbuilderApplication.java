package com.gabrieudev.regexbuilder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.gabrieudev.regexbuilder.infrastructure.config.AppProperties;

@SpringBootApplication(scanBasePackages = "com.gabrieudev.formio")
@ConfigurationPropertiesScan("com.gabrieudev.regexbuilder.infrastructure.config")
@EnableJpaRepositories(basePackages = "com.gabrieudev.regexbuilder.infrastructure.persistence.repository")
@EntityScan(basePackages = "com.gabrieudev.regexbuilder.infrastructure.persistence.entity")
@EnableConfigurationProperties(AppProperties.class)
public class RegexbuilderApplication {

    public static void main(String[] args) {
        SpringApplication.run(RegexbuilderApplication.class, args);
    }

}
