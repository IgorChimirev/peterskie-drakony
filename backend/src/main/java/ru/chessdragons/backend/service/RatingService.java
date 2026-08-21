package ru.chessdragons.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.chessdragons.backend.dto.RatingDtos.RatingEntry;
import ru.chessdragons.backend.model.Student;
import ru.chessdragons.backend.repository.HomeworkRepository;
import ru.chessdragons.backend.repository.StudentRepository;
import ru.chessdragons.backend.repository.TournamentResultRepository;

import java.util.Comparator;
import java.util.List;

/**
 * Расчёт рейтинга: сумма баллов за домашние задания + результаты турниров.
 * Рейтинг считается по собственным данным школы (свои занятия и свои турнирные результаты,
 * которые заносит тренер) — это не тот же модуль, что турнирный тур-оператор.
 */
@Service
@RequiredArgsConstructor
public class RatingService {

    private final StudentRepository studentRepository;
    private final HomeworkRepository homeworkRepository;
    private final TournamentResultRepository tournamentResultRepository;

    public RatingEntry entryFor(Student student) {
        int homeworkPoints = homeworkRepository.findByStudent(student).stream()
                .mapToInt(h -> h.getPoints() != null ? h.getPoints() : 0)
                .sum();
        int tournamentPoints = tournamentResultRepository.findByStudent(student).stream()
                .mapToInt(t -> t.getPoints() != null ? t.getPoints() : 0)
                .sum();
        return new RatingEntry(student.getId(), student.getFullName(), homeworkPoints, tournamentPoints,
                homeworkPoints + tournamentPoints);
    }

    public List<RatingEntry> leaderboard() {
        return studentRepository.findAll().stream()
                .map(this::entryFor)
                .filter(e -> e.getTotalPoints() > 0)
                .sorted(Comparator.comparingInt(RatingEntry::getTotalPoints).reversed())
                .toList();
    }
}
