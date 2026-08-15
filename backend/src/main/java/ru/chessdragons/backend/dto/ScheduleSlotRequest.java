package ru.chessdragons.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ScheduleSlotRequest {
    @NotBlank
    private String groupName;
    private String ageRange;
    private String dayOfWeek;
    private String timeRange;
    private Integer capacity;
    private Integer booked;
    @NotNull
    private Long branchId;
    @NotNull
    private Long trainerId;
}
