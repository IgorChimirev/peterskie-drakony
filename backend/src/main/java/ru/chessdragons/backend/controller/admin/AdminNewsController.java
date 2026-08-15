package ru.chessdragons.backend.controller.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.model.NewsPost;
import ru.chessdragons.backend.repository.NewsPostRepository;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/news")
@RequiredArgsConstructor
public class AdminNewsController {

    private final NewsPostRepository newsPostRepository;

    @GetMapping
    public List<NewsPost> all() {
        return newsPostRepository.findAll(Sort.by(Sort.Direction.DESC, "publishedAt"));
    }

    @PostMapping
    public ResponseEntity<NewsPost> create(@Valid @RequestBody NewsPost post) {
        post.setId(null);
        if (post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDate.now());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(newsPostRepository.save(post));
    }

    @PutMapping("/{id}")
    public NewsPost update(@PathVariable Long id, @Valid @RequestBody NewsPost post) {
        NewsPost existing = newsPostRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Новость не найдена"));
        existing.setTitle(post.getTitle());
        existing.setExcerpt(post.getExcerpt());
        existing.setBody(post.getBody());
        existing.setPublishedAt(post.getPublishedAt() != null ? post.getPublishedAt() : existing.getPublishedAt());
        return newsPostRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        newsPostRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
