package com.gabrieudev.regexbuilder.infrastructure.persistence.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.gabrieudev.regexbuilder.domain.model.PaginationRequest;
import com.gabrieudev.regexbuilder.domain.model.PaginationResponse;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PaginationMapper {
    default <T, R> PaginationResponse<R> map(
            PaginationResponse<T> source,
            java.util.function.Function<T, R> mapper) {

        if (source == null) {
            return null;
        }

        PaginationResponse<R> target = new PaginationResponse<>();

        target.setContent(
                source.getContent() == null
                        ? java.util.List.of()
                        : source.getContent()
                                .stream()
                                .map(mapper)
                                .toList());

        target.setPage(source.getPage());
        target.setSize(source.getSize());
        target.setTotalElements(source.getTotalElements());
        target.setTotalPages(source.getTotalPages());
        target.setLast(source.isLast());

        return target;
    }

    default <T> PaginationResponse<T> toPageResponse(Page<T> page) {
        if (page == null) {
            return null;
        }

        PaginationResponse<T> response = new PaginationResponse<>();
        response.setContent(page.getContent());
        response.setPage(page.getNumber());
        response.setSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setLast(page.isLast());

        return response;
    }

    default Pageable toPageable(PaginationRequest request) {

        if (request == null) {
            return Pageable.unpaged();
        }

        int page = Math.max(request.getPage(), 0);
        int size = request.getSize() > 0 ? request.getSize() : 10;

        Sort sort = Sort.unsorted();

        if (request.getSortBy() != null && !request.getSortBy().isBlank()) {
            sort = request.isAscending()
                    ? Sort.by(request.getSortBy()).ascending()
                    : Sort.by(request.getSortBy()).descending();
        }

        return PageRequest.of(page, size, sort);
    }
}