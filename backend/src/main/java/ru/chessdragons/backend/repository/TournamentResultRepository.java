package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.Student;
import ru.chessdragons.backend.model.TournamentResult;

import java.util.List;

public interface TournamentResultRepository extends JpaRepository<TournamentResult, Long> {
    List<TournamentResult> findByStudent(Student student);
}
