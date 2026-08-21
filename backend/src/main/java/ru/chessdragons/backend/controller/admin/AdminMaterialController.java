package ru.chessdragons.backend.controller.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
import ru.chessdragons.backend.model.LearningMaterial;
import ru.chessdragons.backend.repository.LearningMaterialRepository;

import java.util.List;

@RestController
@RequestMapping("/api/admin/materials")
@RequiredArgsConstructor
public class AdminMaterialController {

    private final LearningMaterialRepository learningMaterialRepository;

    @GetMapping
    public List<LearningMaterial> all() {
        return learningMaterialRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<LearningMaterial> create(@Valid @RequestBody LearningMaterial material) {
        material.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(learningMaterialRepository.save(material));
    }

    @PutMapping("/{id}")
    public LearningMaterial update(@PathVariable Long id, @Valid @RequestBody LearningMaterial material) {
        material.setId(id);
        return learningMaterialRepository.save(material);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        learningMaterialRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
