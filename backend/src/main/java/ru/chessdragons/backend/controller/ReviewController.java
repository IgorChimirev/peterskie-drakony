package ru.chessdragons.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.dto.ReviewDtos.SubmitReviewRequest;
import ru.chessdragons.backend.model.Review;
import ru.chessdragons.backend.repository.ReviewRepository;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;

    @GetMapping
    public List<Review> approved() {
        return reviewRepository.findByApprovedTrue();
    }

    @PostMapping
    public ResponseEntity<Review> submit(@Valid @RequestBody SubmitReviewRequest request) {
        Review review = new Review(null, request.getAuthorName(), request.getRating(), request.getText(),
                false, LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewRepository.save(review));
    }
}
