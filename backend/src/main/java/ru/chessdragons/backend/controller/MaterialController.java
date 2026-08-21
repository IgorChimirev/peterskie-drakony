package ru.chessdragons.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.model.LearningMaterial;
import ru.chessdragons.backend.repository.LearningMaterialRepository;

import java.util.List;

/** Учебные материалы доступны только авторизованным пользователям (родитель/тренер/админ). */
@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
public class MaterialController {

    private final LearningMaterialRepository learningMaterialRepository;

    @GetMapping
    public List<LearningMaterial> all() {
        return learningMaterialRepository.findAll();
    }
}
