package ru.chessdragons.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.dto.PaymentDtos.CheckoutRequest;
import ru.chessdragons.backend.dto.PaymentDtos.CheckoutResponse;
import ru.chessdragons.backend.model.Payment;
import ru.chessdragons.backend.model.Student;
import ru.chessdragons.backend.model.Subscription;
import ru.chessdragons.backend.model.SubscriptionStatus;
import ru.chessdragons.backend.model.Tariff;
import ru.chessdragons.backend.model.User;
import ru.chessdragons.backend.repository.PaymentRepository;
import ru.chessdragons.backend.repository.StudentRepository;
import ru.chessdragons.backend.repository.SubscriptionRepository;
import ru.chessdragons.backend.repository.TariffRepository;
import ru.chessdragons.backend.repository.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final StudentRepository studentRepository;
    private final TariffRepository tariffRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    // Заглушка платёжного шлюза: реального эквайринга (ЮKassa/Тинькофф/CloudPayments) нет,
    // оплата считается успешной сразу — это временная реализация, чтобы показать сквозной сценарий.
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@Valid @RequestBody CheckoutRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(auth.getName()).orElseThrow();

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Ученик не найден"));
        if (!student.getParent().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Это не ваш ученик");
        }

        Tariff tariff = tariffRepository.findById(request.getTariffId())
                .orElseThrow(() -> new IllegalArgumentException("Тариф не найден"));

        Subscription subscription = new Subscription(null, student, tariff,
                tariff.getLessonsCount(), 0, LocalDate.now().plusDays(30), SubscriptionStatus.ACTIVE);
        subscription = subscriptionRepository.save(subscription);

        Payment payment = new Payment(null, subscription, tariff.getPrice(), "SUCCESS", "stub", LocalDateTime.now());
        payment = paymentRepository.save(payment);

        return ResponseEntity.status(HttpStatus.CREATED).body(new CheckoutResponse(payment, subscription));
    }
}
