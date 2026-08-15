package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.NewsPost;

public interface NewsPostRepository extends JpaRepository<NewsPost, Long> {
}
