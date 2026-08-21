package ru.chessdragons.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class VerificationDtos {

    @Data
    public static class RequestCodeResponse {
        private final boolean sent;
        /** Только для демо-режима, т.к. реальная отправка SMS/email не подключена. */
        private final String debugCode;
    }

    @Data
    public static class ConfirmCodeRequest {
        @NotBlank
        private String code;
    }
}
