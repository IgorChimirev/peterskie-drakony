package ru.chessdragons.backend.dto;

import lombok.Data;

public class IntegrationDtos {

    @Data
    public static class IntegrationStatus {
        private final String key;
        private final String name;
        private final String status;
        private final String description;
    }
}
