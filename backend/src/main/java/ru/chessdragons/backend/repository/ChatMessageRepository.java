package ru.chessdragons.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.chessdragons.backend.model.ChatMessage;
import ru.chessdragons.backend.model.User;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByThreadOwnerOrderByCreatedAt(User threadOwner);

    @Query("select distinct m.threadOwner from ChatMessage m order by m.threadOwner.fullName")
    List<User> findThreadOwners();
}
