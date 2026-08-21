package ru.chessdragons.backend.controller.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.dto.StatsDtos.DashboardStats;
import ru.chessdragons.backend.model.Role;
import ru.chessdragons.backend.model.SubscriptionStatus;
import ru.chessdragons.backend.repository.LeadRepository;
import ru.chessdragons.backend.repository.PaymentRepository;
import ru.chessdragons.backend.repository.ReviewRepository;
import ru.chessdragons.backend.repository.StudentRepository;
import ru.chessdragons.backend.repository.SubscriptionRepository;
import ru.chessdragons.backend.repository.UserRepository;
import ru.chessdragons.backend.service.RatingService;

import java.util.Map;
import java.util.stream.Collectors;

/** Внутренняя статистика по собственным данным школы (не внешние системы аналитики). */
@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final LeadRepository leadRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final ReviewRepository reviewRepository;
    private final RatingService ratingService;

    @GetMapping
    public DashboardStats dashboard() {
        var users = userRepository.findAll();
        long totalParents = users.stream().filter(u -> u.getRole() == Role.PARENT).count();
        long totalTrainers = users.stream().filter(u -> u.getRole() == Role.TRAINER).count();

        Map<String, Long> leadsByStatus = leadRepository.findAll().stream()
                .collect(Collectors.groupingBy(l -> l.getStatus() != null ? l.getStatus() : "NEW", Collectors.counting()));

        long activeSubscriptions = subscriptionRepository.findAll().stream()
                .filter(s -> s.getStatus() == SubscriptionStatus.ACTIVE)
                .count();

        int totalRevenue = paymentRepository.findAll().stream()
                .filter(p -> "SUCCESS".equals(p.getStatus()))
                .mapToInt(p -> p.getAmount() != null ? p.getAmount() : 0)
                .sum();

        long pendingReviews = reviewRepository.findAll().stream().filter(r -> !r.isApproved()).count();

        return new DashboardStats(
                users.size(),
                totalParents,
                totalTrainers,
                studentRepository.count(),
                leadsByStatus,
                activeSubscriptions,
                totalRevenue,
                pendingReviews,
                ratingService.leaderboard().stream().limit(5).toList()
        );
    }
}
