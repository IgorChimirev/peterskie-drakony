package ru.chessdragons.backend.dto;

import lombok.Data;

public class RatingDtos {

    @Data
    public static class RatingEntry {
        private final Long studentId;
        private final String studentName;
        private final int homeworkPoints;
        private final int tournamentPoints;
        private final int totalPoints;
    }
}
