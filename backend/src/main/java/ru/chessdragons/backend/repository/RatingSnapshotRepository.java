package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.RatingSnapshot;
import ru.chessdragons.backend.model.Student;

import java.util.List;

public interface RatingSnapshotRepository extends JpaRepository<RatingSnapshot, Long> {
    List<RatingSnapshot> findByStudentOrderByPeriodDesc(Student student);
}
