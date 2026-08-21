package ru.chessdragons.backend.controller.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.dto.AdminUserDtos.CreateUserRequest;
import ru.chessdragons.backend.dto.AdminUserDtos.RoleRequest;
import ru.chessdragons.backend.dto.AdminUserDtos.StatusRequest;
import ru.chessdragons.backend.model.AccountType;
import ru.chessdragons.backend.model.Role;
import ru.chessdragons.backend.model.Trainer;
import ru.chessdragons.backend.model.User;
import ru.chessdragons.backend.model.UserStatus;
import ru.chessdragons.backend.repository.TrainerRepository;
import ru.chessdragons.backend.repository.UserRepository;

import java.util.List;

/** «Модерация пользователей» + «Управление пользователями»: список, создание вручную, роли, блокировка. */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> all() {
        return userRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email уже зарегистрирован");
        }
        Role role = Role.valueOf(request.getRole().toUpperCase());
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(role)
                .accountType(AccountType.ADULT)
                .status(UserStatus.ACTIVE)
                .emailVerified(true)
                .build();
        user = userRepository.save(user);

        if (role == Role.TRAINER && request.getTrainerId() != null) {
            Trainer trainer = trainerRepository.findById(request.getTrainerId()).orElseThrow();
            trainer.setUser(user);
            trainerRepository.save(trainer);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PatchMapping("/{id}/role")
    public User changeRole(@PathVariable Long id, @Valid @RequestBody RoleRequest request) {
        User user = userRepository.findById(id).orElseThrow();
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        return userRepository.save(user);
    }

    @PatchMapping("/{id}/status")
    public User changeStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest request) {
        User user = userRepository.findById(id).orElseThrow();
        user.setStatus(UserStatus.valueOf(request.getStatus().toUpperCase()));
        return userRepository.save(user);
    }
}
