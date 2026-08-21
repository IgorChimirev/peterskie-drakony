package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.Homework;
import ru.chessdragons.backend.model.Student;
import ru.chessdragons.backend.model.Trainer;

import java.util.List;

public interface HomeworkRepository extends JpaRepository<Homework, Long> {
    List<Homework> findByStudent(Student student);
    List<Homework> findByTrainer(Trainer trainer);
}
