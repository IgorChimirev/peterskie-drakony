package ru.chessdragons.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.dto.VerificationDtos.ConfirmCodeRequest;
import ru.chessdragons.backend.dto.VerificationDtos.RequestCodeResponse;
import ru.chessdragons.backend.model.User;
import ru.chessdragons.backend.model.VerificationChannel;
import ru.chessdragons.backend.repository.UserRepository;
import ru.chessdragons.backend.service.VerificationService;

@RestController
@RequestMapping("/api/auth/verify")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;
    private final UserRepository userRepository;

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow();
    }

    @PostMapping("/{channel}/request")
    public RequestCodeResponse requestCode(@PathVariable String channel) {
        VerificationChannel ch = VerificationChannel.valueOf(channel.toUpperCase());
        String code = verificationService.requestCode(currentUser(), ch);
        return new RequestCodeResponse(true, code);
    }

    @PostMapping("/{channel}/confirm")
    public ResponseEntity<?> confirmCode(@PathVariable String channel, @Valid @RequestBody ConfirmCodeRequest request) {
        VerificationChannel ch = VerificationChannel.valueOf(channel.toUpperCase());
        boolean ok = verificationService.confirmCode(currentUser(), ch, request.getCode());
        if (!ok) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Неверный или истёкший код");
        }
        return ResponseEntity.ok().build();
    }
}
