package com.gabrieudev.regexbuilder.infrastructure.persistence.entity;

import java.util.UUID;

import com.gabrieudev.regexbuilder.domain.enums.RegexLanguage;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "regexes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegexEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 1000)
    private String pattern;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RegexLanguage language;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
}
