package ru.chessdragons.backend.dto;

import lombok.Data;
import ru.chessdragons.backend.dto.RatingDtos.RatingEntry;

import java.util.List;
import java.util.Map;

public class StatsDtos {

    @Data
    public static class DashboardStats {
        private final long totalUsers;
        private final long totalParents;
        private final long totalTrainers;
        private final long totalStudents;
        private final Map<String, Long> leadsByStatus;
        private final long activeSubscriptions;
        private final int totalRevenue;
        private final long pendingReviews;
        private final List<RatingEntry> topRating;
    }
}
