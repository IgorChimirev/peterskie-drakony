package ru.chessdragons.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.chessdragons.backend.model.Notification;
import ru.chessdragons.backend.model.User;
import ru.chessdragons.backend.repository.NotificationRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void notify(User user, String title, String body) {
        notificationRepository.save(Notification.builder()
                .user(user)
                .title(title)
                .body(body)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build());
    }
}
