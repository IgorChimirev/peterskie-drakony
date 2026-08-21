package ru.chessdragons.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ru.chessdragons.backend.dto.RatingDtos.RatingEntry;
import ru.chessdragons.backend.model.RatingSnapshot;
import ru.chessdragons.backend.model.Student;
import ru.chessdragons.backend.repository.RatingSnapshotRepository;
import ru.chessdragons.backend.repository.StudentRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/** Ежемесячное обновление рейтинга (1-го числа каждого месяца в 03:00). */
@Component
@RequiredArgsConstructor
public class RatingScheduler {

    private final RatingService ratingService;
    private final StudentRepository studentRepository;
    private final RatingSnapshotRepository ratingSnapshotRepository;
    private static final DateTimeFormatter PERIOD_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM");

    @Scheduled(cron = "0 0 3 1 * *")
    public void recalculateMonthly() {
        recalculateNow();
    }

    public int recalculateNow() {
        String period = LocalDateTime.now().format(PERIOD_FORMAT);
        int count = 0;
        for (Student student : studentRepository.findAll()) {
            RatingEntry entry = ratingService.entryFor(student);
            if (entry.getTotalPoints() == 0) continue;
            ratingSnapshotRepository.save(RatingSnapshot.builder()
                    .student(student)
                    .period(period)
                    .totalPoints(entry.getTotalPoints())
                    .computedAt(LocalDateTime.now())
                    .build());
            count++;
        }
        return count;
    }
}
