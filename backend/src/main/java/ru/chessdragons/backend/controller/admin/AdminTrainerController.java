package ru.chessdragons.backend.controller.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.model.Trainer;
import ru.chessdragons.backend.repository.TrainerRepository;

@RestController
@RequestMapping("/api/admin/trainers")
@RequiredArgsConstructor
public class AdminTrainerController {

    private final TrainerRepository trainerRepository;

    @PostMapping
    public ResponseEntity<Trainer> create(@Valid @RequestBody Trainer trainer) {
        trainer.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(trainerRepository.save(trainer));
    }

    @PutMapping("/{id}")
    public Trainer update(@PathVariable Long id, @Valid @RequestBody Trainer trainer) {
        trainer.setId(id);
        return trainerRepository.save(trainer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        trainerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
