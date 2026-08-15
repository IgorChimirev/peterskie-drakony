package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
