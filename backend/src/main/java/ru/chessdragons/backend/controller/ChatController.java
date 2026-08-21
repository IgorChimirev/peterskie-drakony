package ru.chessdragons.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.dto.ChatDtos.SendMessageRequest;
import ru.chessdragons.backend.model.ChatMessage;
import ru.chessdragons.backend.model.User;
import ru.chessdragons.backend.repository.ChatMessageRepository;
import ru.chessdragons.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

/** Чат родителя с клубом (со стороны родителя — свой единственный тред). */
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow();
    }

    @GetMapping("/messages")
    public List<ChatMessage> myMessages() {
        User user = currentUser();
        List<ChatMessage> messages = chatMessageRepository.findByThreadOwnerOrderByCreatedAt(user);
        messages.stream().filter(m -> !m.isReadByParent()).forEach(m -> m.setReadByParent(true));
        chatMessageRepository.saveAll(messages);
        return messages;
    }

    @PostMapping("/messages")
    public ResponseEntity<ChatMessage> send(@Valid @RequestBody SendMessageRequest request) {
        User user = currentUser();
        ChatMessage message = ChatMessage.builder()
                .threadOwner(user)
                .sender(user)
                .text(request.getText())
                .createdAt(LocalDateTime.now())
                .readByParent(true)
                .readByStaff(false)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(chatMessageRepository.save(message));
    }
}
