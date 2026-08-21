package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.ScheduleSlot;
import ru.chessdragons.backend.model.Student;
import ru.chessdragons.backend.model.User;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByParent(User parent);
    List<Student> findByScheduleSlotIn(List<ScheduleSlot> scheduleSlots);
}
