package com.gabrieudev.regexbuilder.infrastructure.persistence.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.gabrieudev.regexbuilder.infrastructure.persistence.entity.CollectionEntity;

@Repository
public interface CollectionJpaRepository
        extends JpaRepository<CollectionEntity, UUID>, JpaSpecificationExecutor<CollectionEntity> {

    @Override
    @EntityGraph(attributePaths = "user")
    Page<CollectionEntity> findAll(Specification<CollectionEntity> spec, Pageable pageable);

    default Page<CollectionEntity> findAllWithFilters(
            String name,
            String description,
            String color,
            String icon,
            Boolean pinned,
            List<String> tags,
            UUID userId,
            LocalDateTime createdAtFrom,
            LocalDateTime createdAtTo,
            Pageable pageable) {

        Specification<CollectionEntity> spec = (root, query, cb) -> cb.conjunction();

        if (name != null && !name.isEmpty()) {
            spec = spec.and(
                    (root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }

        if (description != null && !description.isEmpty()) {
            spec = spec.and(
                    (root, query, cb) -> cb.like(cb.lower(root.get("description")),
                            "%" + description.toLowerCase() + "%"));
        }

        if (color != null && !color.isEmpty()) {
            spec = spec.and(
                    (root, query, cb) -> cb.equal(root.get("color"), color));
        }

        if (icon != null && !icon.isEmpty()) {
            spec = spec.and(
                    (root, query, cb) -> cb.equal(root.get("icon"), icon));
        }

        if (pinned != null) {
            spec = spec.and(
                    (root, query, cb) -> cb.equal(root.get("pinned"), pinned));
        }

        if (userId != null) {
            spec = spec.and(
                    (root, query, cb) -> cb.equal(root.get("user").get("id"), userId));
        }

        if (createdAtFrom != null) {
            spec = spec.and(
                    (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), createdAtFrom));
        }

        if (createdAtTo != null) {
            spec = spec.and(
                    (root, query, cb) -> cb.lessThanOrEqualTo(root.get("createdAt"), createdAtTo));
        }

        // filtro simples para tags (PostgreSQL TEXT[])
        if (tags != null && !tags.isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                var predicates = tags.stream()
                        .map(tag -> cb.isMember(tag, root.get("tags")))
                        .toArray(jakarta.persistence.criteria.Predicate[]::new);
                return cb.or(predicates);
            });
        }

        return findAll(spec, pageable);
    }
}