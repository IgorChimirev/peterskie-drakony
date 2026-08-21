package ru.chessdragons.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.dto.RatingDtos.RatingEntry;
import ru.chessdragons.backend.service.RatingService;

import java.util.List;

@RestController
@RequestMapping("/api/rating")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @GetMapping
    public List<RatingEntry> leaderboard() {
        return ratingService.leaderboard();
    }
}
