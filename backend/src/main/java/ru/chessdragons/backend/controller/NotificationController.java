package ru.chessdragons.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.model.Notification;
import ru.chessdragons.backend.model.User;
import ru.chessdragons.backend.repository.NotificationRepository;
import ru.chessdragons.backend.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow();
    }

    @GetMapping
    public List<Notification> mine() {
        return notificationRepository.findByUserOrderByCreatedAtDesc(currentUser());
    }

    @PatchMapping("/{id}/read")
    public Notification markRead(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id).orElseThrow();
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
}
