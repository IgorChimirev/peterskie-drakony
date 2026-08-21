package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.GalleryItem;

public interface GalleryItemRepository extends JpaRepository<GalleryItem, Long> {
}
