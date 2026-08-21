package ru.chessdragons.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Журнал "отправленных" писем. Реальный SMTP не подключён (внешний сервис, вне скоупа демо) —
 * EmailService лишь пишет сюда, имитируя рассылку.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String toAddress;
    private String subject;

    @Lob
    private String body;

    private LocalDateTime sentAt;
    private String status;
}
