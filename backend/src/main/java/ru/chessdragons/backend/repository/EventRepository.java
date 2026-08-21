package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.chessdragons.backend.model.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
}
