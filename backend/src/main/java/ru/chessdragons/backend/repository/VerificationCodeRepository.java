package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.User;
import ru.chessdragons.backend.model.VerificationChannel;
import ru.chessdragons.backend.model.VerificationCode;

import java.util.Optional;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    Optional<VerificationCode> findFirstByUserAndChannelAndUsedFalseOrderByIdDesc(User user, VerificationChannel channel);
}
