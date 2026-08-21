package ru.chessdragons.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Внутренний чат (без внешних сервисов вроде Telegram/WhatsApp).
 * Тред привязан к родителю (threadOwner) — с ним общаются сотрудники клуба (админ/тренер).
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User threadOwner;

    @ManyToOne
    private User sender;

    @Lob
    private String text;

    private LocalDateTime createdAt;
    private boolean readByParent;
    private boolean readByStaff;
}
