package ru.chessdragons.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.chessdragons.backend.model.EmailLog;
import ru.chessdragons.backend.repository.EmailLogRepository;

import java.time.LocalDateTime;

/**
 * Заглушка почтового сервиса: реальный SMTP/провайдер рассылок — внешняя интеграция,
 * вне скоупа демо-версии. Вместо реальной отправки пишем в журнал EmailLog, который
 * виден администратору в разделе «Интеграции» / «Письма».
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final EmailLogRepository emailLogRepository;

    public void send(String to, String subject, String body) {
        log.info("[STUB EMAIL] to={} subject={} body={}", to, subject, body);
        emailLogRepository.save(EmailLog.builder()
                .toAddress(to)
                .subject(subject)
                .body(body)
                .sentAt(LocalDateTime.now())
                .status("STUBBED")
                .build());
    }
}
