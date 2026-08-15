package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.ScheduleSlot;

public interface ScheduleSlotRepository extends JpaRepository<ScheduleSlot, Long> {
}
