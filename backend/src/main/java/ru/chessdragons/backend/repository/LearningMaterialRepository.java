package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.LearningMaterial;

public interface LearningMaterialRepository extends JpaRepository<LearningMaterial, Long> {
}
