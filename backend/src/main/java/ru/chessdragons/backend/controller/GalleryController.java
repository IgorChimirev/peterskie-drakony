package ru.chessdragons.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.model.GalleryItem;
import ru.chessdragons.backend.repository.GalleryItemRepository;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryItemRepository galleryItemRepository;

    @GetMapping
    public List<GalleryItem> all() {
        return galleryItemRepository.findAll(Sort.by(Sort.Direction.DESC, "eventDate"));
    }
}
