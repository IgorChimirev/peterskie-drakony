package ru.chessdragons.backend.controller.admin;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.service.RatingScheduler;

/** Ежемесячный пересчёт рейтинга обычно идёт по расписанию (1-го числа), здесь — ручной запуск для демонстрации. */
@RestController
@RequestMapping("/api/admin/rating")
@RequiredArgsConstructor
public class AdminRatingController {

    private final RatingScheduler ratingScheduler;

    @PostMapping("/recalculate")
    public RecalculateResponse recalculate() {
        int count = ratingScheduler.recalculateNow();
        return new RecalculateResponse(count);
    }

    @Data
    public static class RecalculateResponse {
        private final int studentsUpdated;
    }
}
