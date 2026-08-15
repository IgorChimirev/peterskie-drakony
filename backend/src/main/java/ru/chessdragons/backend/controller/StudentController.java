package ru.chessdragons.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.dto.StudentDtos.CreateStudentRequest;
import ru.chessdragons.backend.dto.StudentDtos.StudentView;
import ru.chessdragons.backend.model.Branch;
import ru.chessdragons.backend.model.Student;
import ru.chessdragons.backend.model.User;
import ru.chessdragons.backend.repository.BranchRepository;
import ru.chessdragons.backend.repository.StudentRepository;
import ru.chessdragons.backend.repository.SubscriptionRepository;
import ru.chessdragons.backend.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow();
    }

    @GetMapping
    public List<StudentView> mine() {
        User parent = currentUser();
        return studentRepository.findByParent(parent).stream()
                .map(s -> new StudentView(s.getId(), s.getFullName(), s.getAge(), s.getBranch(),
                        subscriptionRepository.findByStudent(s)))
                .toList();
    }

    @PostMapping
    public Student create(@Valid @RequestBody CreateStudentRequest request) {
        User parent = currentUser();
        Branch branch = request.getBranchId() != null ? branchRepository.findById(request.getBranchId()).orElse(null) : null;
        Student student = new Student(null, request.getFullName(), request.getAge(), parent, branch, null);
        return studentRepository.save(student);
    }
}
