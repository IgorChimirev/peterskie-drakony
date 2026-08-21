package ru.chessdragons.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AuthDtos {

    @Data
    public static class RegisterRequest {
        @NotBlank
        private String fullName;
        @Email
        @NotBlank
        private String email;
        @NotBlank
        private String password;
        private String phone;
        /** ADULT — регистрируется как самостоятельный участник, PARENT — как родитель, будет добавлять детей. */
        private String accountType;
    }

    @Data
    public static class LoginRequest {
        @NotBlank
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class AuthResponse {
        private final String token;
        private final String fullName;
        private final String role;
        private final boolean emailVerified;
    }
}
