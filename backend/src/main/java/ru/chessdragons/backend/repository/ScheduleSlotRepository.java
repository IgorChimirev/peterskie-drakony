package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.ScheduleSlot;
import ru.chessdragons.backend.model.Trainer;

import java.util.List;

public interface ScheduleSlotRepository extends JpaRepository<ScheduleSlot, Long> {
    List<ScheduleSlot> findByTrainer(Trainer trainer);
}
