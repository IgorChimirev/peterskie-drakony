package ru.chessdragons.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import ru.chessdragons.backend.model.Branch;
import ru.chessdragons.backend.model.Subscription;

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
    public static class StudentView {
        private final Long id;
        private final String fullName;
        private final String age;
        private final Branch branch;
        private final List<Subscription> subscriptions;
    }
}
