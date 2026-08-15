package ru.chessdragons.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.model.Trainer;
import ru.chessdragons.backend.repository.TrainerRepository;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerRepository trainerRepository;

    @GetMapping
    public List<Trainer> all() {
        return trainerRepository.findAll(Sort.by("sortOrder"));
    }
}
