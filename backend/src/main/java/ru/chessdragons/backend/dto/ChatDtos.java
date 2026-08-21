package ru.chessdragons.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class ChatDtos {

    @Data
    public static class SendMessageRequest {
        @NotBlank
        private String text;
    }
}
