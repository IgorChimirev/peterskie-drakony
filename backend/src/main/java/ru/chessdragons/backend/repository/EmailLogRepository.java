package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.EmailLog;

public interface EmailLogRepository extends JpaRepository<EmailLog, Long> {
}
