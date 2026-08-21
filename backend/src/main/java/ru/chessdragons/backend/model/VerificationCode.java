package ru.chessdragons.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Код подтверждения email/телефона. Реальная отправка (SMTP/SMS-шлюз) не подключена —
 * это внешний сервис, за пределами демо-скоупа. Код "отправляется" через EmailService-заглушку
 * (пишется в EmailLog) и для удобства демо возвращается прямо в ответе API.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @Enumerated(EnumType.STRING)
    private VerificationChannel channel;

    private String code;
    private LocalDateTime expiresAt;
    private boolean used;
}
