package ru.chessdragons.backend.controller.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.dto.ChatDtos.SendMessageRequest;
import ru.chessdragons.backend.model.ChatMessage;
import ru.chessdragons.backend.model.User;
import ru.chessdragons.backend.repository.ChatMessageRepository;
import ru.chessdragons.backend.repository.UserRepository;
import ru.chessdragons.backend.service.NotificationService;

import java.time.LocalDateTime;
import java.util.List;

/** Раздел «Чат» в админ-панели: список тредов (по одному на родителя) и переписка. */
@RestController
@RequestMapping("/api/admin/chat")
@RequiredArgsConstructor
public class AdminChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow();
    }

    @GetMapping("/threads")
    public List<User> threads() {
        return chatMessageRepository.findThreadOwners();
    }

    @GetMapping("/threads/{parentId}/messages")
    public List<ChatMessage> threadMessages(@PathVariable Long parentId) {
        User parent = userRepository.findById(parentId).orElseThrow();
        List<ChatMessage> messages = chatMessageRepository.findByThreadOwnerOrderByCreatedAt(parent);
        messages.stream().filter(m -> !m.isReadByStaff()).forEach(m -> m.setReadByStaff(true));
        chatMessageRepository.saveAll(messages);
        return messages;
    }

    @PostMapping("/threads/{parentId}/messages")
    public ChatMessage reply(@PathVariable Long parentId, @Valid @RequestBody SendMessageRequest request) {
        User parent = userRepository.findById(parentId).orElseThrow();
        ChatMessage message = ChatMessage.builder()
                .threadOwner(parent)
                .sender(currentUser())
                .text(request.getText())
                .createdAt(LocalDateTime.now())
                .readByParent(false)
                .readByStaff(true)
                .build();
        ChatMessage saved = chatMessageRepository.save(message);
        notificationService.notify(parent, "Новое сообщение от клуба", request.getText());
        return saved;
    }
}
