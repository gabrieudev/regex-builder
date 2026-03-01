package com.gabrieudev.regexbuilder.domain.model;

public class PaginationRequest {
    private Integer page;
    private Integer size;
    private String sortBy;
    private boolean ascending;

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public boolean isAscending() {
        return ascending;
    }

    public void setAscending(boolean ascending) {
        this.ascending = ascending;
    }

    public PaginationRequest(Integer page, Integer size, String sortBy, boolean ascending) {
        this.page = page;
        this.size = size;
        this.sortBy = sortBy;
        this.ascending = ascending;
    }

    public PaginationRequest() {
    }

}
