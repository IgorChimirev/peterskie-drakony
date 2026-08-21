package ru.chessdragons.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AdminUserDtos {

    @Data
    public static class CreateUserRequest {
        @NotBlank
        private String fullName;
        @Email
        @NotBlank
        private String email;
        @NotBlank
        private String password;
        @NotBlank
        private String role;
        /** Если role=TRAINER — привязать к существующей карточке тренера (Trainer.id). */
        private Long trainerId;
    }

    @Data
    public static class RoleRequest {
        @NotBlank
        private String role;
    }

    @Data
    public static class StatusRequest {
        @NotBlank
        private String status;
    }
}
