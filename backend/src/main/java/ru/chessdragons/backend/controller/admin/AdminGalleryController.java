package ru.chessdragons.backend.controller.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.model.GalleryItem;
import ru.chessdragons.backend.repository.GalleryItemRepository;

import java.util.List;

@RestController
@RequestMapping("/api/admin/gallery")
@RequiredArgsConstructor
public class AdminGalleryController {

    private final GalleryItemRepository galleryItemRepository;

    @GetMapping
    public List<GalleryItem> all() {
        return galleryItemRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<GalleryItem> create(@Valid @RequestBody GalleryItem item) {
        item.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(galleryItemRepository.save(item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        galleryItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
