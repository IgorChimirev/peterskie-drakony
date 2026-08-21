package ru.chessdragons.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class ReviewDtos {

    @Data
    public static class SubmitReviewRequest {
        @NotBlank
        private String authorName;
        @Min(1)
        @Max(5)
        private Integer rating;
        @NotBlank
        private String text;
    }
}
