package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.Branch;

public interface BranchRepository extends JpaRepository<Branch, Long> {
}
