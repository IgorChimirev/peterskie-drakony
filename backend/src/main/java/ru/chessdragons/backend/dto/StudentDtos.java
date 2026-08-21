package ru.chessdragons.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ru.chessdragons.backend.model.Branch;
import ru.chessdragons.backend.model.Homework;
import ru.chessdragons.backend.model.ScheduleSlot;
import ru.chessdragons.backend.model.Subscription;
import ru.chessdragons.backend.model.TournamentResult;

import java.util.List;

public class StudentDtos {

    @Data
    public static class CreateStudentRequest {
        @NotBlank
        private String fullName;
        private String age;
        private Long branchId;
    }

    @Data
    public static class UpdateStudentRequest {
        @NotBlank
        private String fullName;
        private String age;
        private Long branchId;
    }

    @Data
    public static class EnrollRequest {
        @NotNull
        private Long scheduleSlotId;
    }

    @Data
    public static class StudentView {
        private final Long id;
        private final String fullName;
        private final String age;
        private final Branch branch;
        private final ScheduleSlot scheduleSlot;
        private final List<Subscription> subscriptions;
        private final List<Homework> homework;
        private final List<TournamentResult> tournamentResults;
        private final int ratingPoints;
    }
}
