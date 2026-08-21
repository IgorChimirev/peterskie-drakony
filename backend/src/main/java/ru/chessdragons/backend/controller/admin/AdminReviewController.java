package ru.chessdragons.backend.controller.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.model.Review;
import ru.chessdragons.backend.repository.ReviewRepository;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {

    private final ReviewRepository reviewRepository;

    @GetMapping
    public List<Review> all() {
        return reviewRepository.findAll();
    }

    @PatchMapping("/{id}/approve")
    public Review approve(@PathVariable Long id) {
        Review review = reviewRepository.findById(id).orElseThrow();
        review.setApproved(true);
        return reviewRepository.save(review);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reviewRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
