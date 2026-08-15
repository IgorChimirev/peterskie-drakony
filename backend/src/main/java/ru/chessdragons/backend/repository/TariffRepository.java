package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.Tariff;

public interface TariffRepository extends JpaRepository<Tariff, Long> {
}
