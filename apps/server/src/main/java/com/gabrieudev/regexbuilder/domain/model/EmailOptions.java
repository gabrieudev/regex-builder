package com.gabrieudev.regexbuilder.domain.model;

public class EmailOptions {
    private String to;
    private String name;
    private String actionUrl;
    private String companyName;
    private String supportEmail;

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getActionUrl() {
        return actionUrl;
    }

    public void setActionUrl(String actionUrl) {
        this.actionUrl = actionUrl;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getSupportEmail() {
        return supportEmail;
    }

    public void setSupportEmail(String supportEmail) {
        this.supportEmail = supportEmail;
    }

    public EmailOptions(String to, String name, String actionUrl, String companyName,
            String supportEmail) {
        this.to = to;
        this.name = name;
        this.actionUrl = actionUrl;
        this.companyName = companyName;
        this.supportEmail = supportEmail;
    }

    public EmailOptions() {
    }

}