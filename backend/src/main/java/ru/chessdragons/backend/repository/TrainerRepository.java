package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.Trainer;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
}
