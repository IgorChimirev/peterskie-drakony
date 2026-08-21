package ru.chessdragons.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.chessdragons.backend.model.User;
import ru.chessdragons.backend.model.VerificationChannel;
import ru.chessdragons.backend.model.VerificationCode;
import ru.chessdragons.backend.repository.UserRepository;
import ru.chessdragons.backend.repository.VerificationCodeRepository;

import java.security.SecureRandom;
import java.time.LocalDateTime;

/**
 * Верификация email/телефона. Реальная отправка SMS/писем — внешние сервисы, вне скоупа демо:
 * код "доставляется" через EmailService-заглушку (лог) и дополнительно возвращается в ответе API,
 * чтобы сценарий можно было пройти целиком без реального почтового ящика или телефона.
 */
@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationCodeRepository verificationCodeRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private static final SecureRandom RANDOM = new SecureRandom();

    public String requestCode(User user, VerificationChannel channel) {
        String code = String.format("%06d", RANDOM.nextInt(1_000_000));
        VerificationCode verification = VerificationCode.builder()
                .user(user)
                .channel(channel)
                .code(code)
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .used(false)
                .build();
        verificationCodeRepository.save(verification);

        if (channel == VerificationChannel.EMAIL) {
            emailService.send(user.getEmail(), "Код подтверждения — Питерские драконы",
                    "Ваш код подтверждения: " + code);
        } else {
            // SMS-провайдер не подключён (внешний сервис) — код только логируется через EmailService-заглушку.
            emailService.send(user.getPhone() != null ? user.getPhone() : "unknown-phone",
                    "[SMS-заглушка] Код подтверждения телефона", "Код: " + code);
        }
        return code;
    }

    public boolean confirmCode(User user, VerificationChannel channel, String code) {
        VerificationCode verification = verificationCodeRepository
                .findFirstByUserAndChannelAndUsedFalseOrderByIdDesc(user, channel)
                .orElse(null);

        if (verification == null || !verification.getCode().equals(code)
                || verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }

        verification.setUsed(true);
        verificationCodeRepository.save(verification);

        if (channel == VerificationChannel.EMAIL) {
            user.setEmailVerified(true);
        } else {
            user.setPhoneVerified(true);
        }
        userRepository.save(user);
        return true;
    }
}
