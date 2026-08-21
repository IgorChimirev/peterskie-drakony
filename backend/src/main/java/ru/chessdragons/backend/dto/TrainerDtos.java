package ru.chessdragons.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class TrainerDtos {

    @Data
    public static class CreateHomeworkRequest {
        @NotNull
        private Long studentId;
        @NotBlank
        private String description;
        @NotNull
        private Integer points;
    }

    @Data
    public static class CreateTournamentResultRequest {
        @NotNull
        private Long studentId;
        @NotBlank
        private String tournamentName;
        private String place;
        @NotNull
        private Integer points;
    }
}
