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

import com.gabrieudev.regexbuilder.domain.enums.RegexLanguage;
import com.gabrieudev.regexbuilder.infrastructure.persistence.entity.RegexEntity;

@Repository
public interface RegexJpaRepository extends JpaRepository<RegexEntity, UUID>, JpaSpecificationExecutor<RegexEntity> {

    @Override
    @EntityGraph(attributePaths = "createdBy")
    Page<RegexEntity> findAll(Specification<RegexEntity> spec, Pageable pageable);

    default Page<RegexEntity> findAllWithFilters(
            String pattern,
            String exactPattern,
            String name,
            RegexLanguage language,
            UUID createdById,
            LocalDateTime createdAtFrom,
            LocalDateTime createdAtTo,
            Pageable pageable) {

        Specification<RegexEntity> spec = (root, query, cb) -> cb.conjunction();

        if (pattern != null && !pattern.isEmpty()) {
            if ("true".equalsIgnoreCase(exactPattern)) {
                spec = spec.and((root, query, cb) -> cb.equal(root.get("pattern"), pattern));
            } else {
                spec = spec.and(
                        (root, query, cb) -> cb.like(cb.lower(root.get("pattern")), "%" + pattern.toLowerCase() + "%"));
            }
        }

        if (name != null && !name.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }

        if (language != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("language"), language));
        }

        if (createdById != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("createdBy").get("id"), createdById));
        }

        if (createdAtFrom != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), createdAtFrom));
        }

        if (createdAtTo != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("createdAt"), createdAtTo));
        }

        return findAll(spec, pageable);
    }
}