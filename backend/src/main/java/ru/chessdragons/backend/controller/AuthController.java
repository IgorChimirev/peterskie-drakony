package ru.chessdragons.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.dto.UpdateProfileRequest;
import ru.chessdragons.backend.dto.AuthDtos.AuthResponse;
import ru.chessdragons.backend.dto.AuthDtos.LoginRequest;
import ru.chessdragons.backend.dto.AuthDtos.RegisterRequest;
import ru.chessdragons.backend.model.AccountType;
import ru.chessdragons.backend.model.Role;
import ru.chessdragons.backend.model.Student;
import ru.chessdragons.backend.model.User;
import ru.chessdragons.backend.model.UserStatus;
import ru.chessdragons.backend.repository.StudentRepository;
import ru.chessdragons.backend.repository.UserRepository;
import ru.chessdragons.backend.security.JwtService;
import ru.chessdragons.backend.service.NotificationService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final NotificationService notificationService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email уже зарегистрирован");
        }

        AccountType accountType = "ADULT".equalsIgnoreCase(request.getAccountType())
                ? AccountType.ADULT : AccountType.PARENT;

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(Role.PARENT)
                .accountType(accountType)
                .status(UserStatus.ACTIVE)
                .build();
        userRepository.save(user);

        if (accountType == AccountType.ADULT) {
            // Взрослый участник занимается сам — заводим ему собственную карточку "ученика",
            // чтобы переиспользовать существующую модель абонементов/записи на занятия.
            studentRepository.save(new Student(null, request.getFullName(), null, user, null, null));
        }

        notificationService.notify(user, "Добро пожаловать в «Питерские драконы»!",
                "Регистрация прошла успешно. Подтвердите email в личном кабинете, чтобы получить доступ ко всем функциям.");

        String token = jwtService.generateToken(user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(token, user.getFullName(), user.getRole().name(), user.isEmailVerified()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверный email или пароль");
        }

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        if (user.getStatus() == UserStatus.BLOCKED) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Аккаунт заблокирован администратором");
        }
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token, user.getFullName(), user.getRole().name(), user.isEmailVerified()));
    }

    @GetMapping("/me")
    public ResponseEntity<User> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateMe(@Valid @RequestBody UpdateProfileRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        return ResponseEntity.ok(userRepository.save(user));
    }
}
