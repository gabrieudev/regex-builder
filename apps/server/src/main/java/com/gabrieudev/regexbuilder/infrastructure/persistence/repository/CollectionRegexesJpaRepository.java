package com.gabrieudev.regexbuilder.infrastructure.persistence.repository;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.gabrieudev.regexbuilder.infrastructure.persistence.entity.CollectionRegexesEntity;

@Repository
public interface CollectionRegexesJpaRepository
        extends JpaRepository<CollectionRegexesEntity, UUID>, JpaSpecificationExecutor<CollectionRegexesEntity> {

    @Override
    @EntityGraph(attributePaths = { "collection", "regex", "regex.createdBy" })
    Page<CollectionRegexesEntity> findAll(Specification<CollectionRegexesEntity> spec, Pageable pageable);

    default Page<CollectionRegexesEntity> findAllWithFilters(
            UUID collectionId,
            UUID regexId,
            String regexName,
            String regexPattern,
            LocalDateTime addedAtFrom,
            LocalDateTime addedAtTo,
            Pageable pageable) {

        Specification<CollectionRegexesEntity> spec = (root, query, cb) -> cb.conjunction();

        if (collectionId != null) {
            spec = spec.and(
                    (root, query, cb) -> cb.equal(root.get("collection").get("id"), collectionId));
        }

        if (regexId != null) {
            spec = spec.and(
                    (root, query, cb) -> cb.equal(root.get("regex").get("id"), regexId));
        }

        if (regexName != null && !regexName.isEmpty()) {
            spec = spec.and(
                    (root, query, cb) -> cb.like(
                            cb.lower(root.get("regex").get("name")),
                            "%" + regexName.toLowerCase() + "%"));
        }

        if (regexPattern != null && !regexPattern.isEmpty()) {
            spec = spec.and(
                    (root, query, cb) -> cb.like(
                            cb.lower(root.get("regex").get("pattern")),
                            "%" + regexPattern.toLowerCase() + "%"));
        }

        if (addedAtFrom != null) {
            spec = spec.and(
                    (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("addedAt"), addedAtFrom));
        }

        if (addedAtTo != null) {
            spec = spec.and(
                    (root, query, cb) -> cb.lessThanOrEqualTo(root.get("addedAt"), addedAtTo));
        }

        return findAll(spec, pageable);
    }
}