package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
