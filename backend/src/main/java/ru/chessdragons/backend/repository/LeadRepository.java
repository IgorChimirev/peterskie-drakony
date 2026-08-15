package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.Lead;

public interface LeadRepository extends JpaRepository<Lead, Long> {
}
