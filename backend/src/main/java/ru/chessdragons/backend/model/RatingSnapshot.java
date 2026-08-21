package ru.chessdragons.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/** Ежемесячный снимок рейтинга ученика — создаётся планировщиком (@Scheduled), 1-го числа каждого месяца. */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Student student;

    /** Период в формате YYYY-MM. */
    private String period;
    private Integer totalPoints;
    private LocalDateTime computedAt;
}
