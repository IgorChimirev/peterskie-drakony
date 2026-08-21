package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.Review;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByApprovedTrue();
}
