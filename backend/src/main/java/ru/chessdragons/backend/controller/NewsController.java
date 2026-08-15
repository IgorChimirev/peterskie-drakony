package ru.chessdragons.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.model.NewsPost;
import ru.chessdragons.backend.repository.NewsPostRepository;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsPostRepository newsPostRepository;

    @GetMapping
    public List<NewsPost> all() {
        return newsPostRepository.findAll(Sort.by(Sort.Direction.DESC, "publishedAt"));
    }
}
