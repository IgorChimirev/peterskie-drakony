package ru.chessdragons.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.dto.StudentDtos.CreateStudentRequest;
import ru.chessdragons.backend.dto.StudentDtos.EnrollRequest;
import ru.chessdragons.backend.dto.StudentDtos.StudentView;
import ru.chessdragons.backend.dto.StudentDtos.UpdateStudentRequest;
import ru.chessdragons.backend.model.Branch;
import ru.chessdragons.backend.model.ScheduleSlot;
import ru.chessdragons.backend.model.Student;
import ru.chessdragons.backend.model.User;
import ru.chessdragons.backend.repository.BranchRepository;
import ru.chessdragons.backend.repository.HomeworkRepository;
import ru.chessdragons.backend.repository.ScheduleSlotRepository;
import ru.chessdragons.backend.repository.StudentRepository;
import ru.chessdragons.backend.repository.SubscriptionRepository;
import ru.chessdragons.backend.repository.TournamentResultRepository;
import ru.chessdragons.backend.repository.UserRepository;
import ru.chessdragons.backend.service.RatingService;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final BranchRepository branchRepository;
    private final ScheduleSlotRepository scheduleSlotRepository;
    private final HomeworkRepository homeworkRepository;
    private final TournamentResultRepository tournamentResultRepository;
    private final RatingService ratingService;
    private final UserRepository userRepository;

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow();
    }

    private Student ownedStudent(Long id, User parent) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ученик не найден"));
        if (!student.getParent().getId().equals(parent.getId())) {
            throw new IllegalStateException("Это не ваш ученик");
        }
        return student;
    }

    private StudentView toView(Student s) {
        return new StudentView(s.getId(), s.getFullName(), s.getAge(), s.getBranch(), s.getScheduleSlot(),
                subscriptionRepository.findByStudent(s),
                homeworkRepository.findByStudent(s),
                tournamentResultRepository.findByStudent(s),
                ratingService.entryFor(s).getTotalPoints());
    }

    @GetMapping
    public List<StudentView> mine() {
        User parent = currentUser();
        return studentRepository.findByParent(parent).stream().map(this::toView).toList();
    }

    @PostMapping
    public StudentView create(@Valid @RequestBody CreateStudentRequest request) {
        User parent = currentUser();
        Branch branch = request.getBranchId() != null ? branchRepository.findById(request.getBranchId()).orElse(null) : null;
        Student student = new Student(null, request.getFullName(), request.getAge(), parent, branch, null);
        return toView(studentRepository.save(student));
    }

    @PutMapping("/{id}")
    public StudentView update(@PathVariable Long id, @Valid @RequestBody UpdateStudentRequest request) {
        Student student = ownedStudent(id, currentUser());
        Branch branch = request.getBranchId() != null ? branchRepository.findById(request.getBranchId()).orElse(null) : null;
        student.setFullName(request.getFullName());
        student.setAge(request.getAge());
        student.setBranch(branch);
        return toView(studentRepository.save(student));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Student student = ownedStudent(id, currentUser());
        if (student.getScheduleSlot() != null) {
            releaseSlot(student.getScheduleSlot());
        }
        studentRepository.delete(student);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/enroll")
    public ResponseEntity<?> enroll(@PathVariable Long id, @Valid @RequestBody EnrollRequest request) {
        Student student = ownedStudent(id, currentUser());
        ScheduleSlot slot = scheduleSlotRepository.findById(request.getScheduleSlotId())
                .orElseThrow(() -> new IllegalArgumentException("Занятие не найдено"));

        if (student.getScheduleSlot() != null && student.getScheduleSlot().getId().equals(slot.getId())) {
            return ResponseEntity.ok(toView(student));
        }
        if (slot.getBooked() != null && slot.getCapacity() != null && slot.getBooked() >= slot.getCapacity()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("В группе нет свободных мест");
        }

        if (student.getScheduleSlot() != null) {
            releaseSlot(student.getScheduleSlot());
        }
        slot.setBooked((slot.getBooked() != null ? slot.getBooked() : 0) + 1);
        scheduleSlotRepository.save(slot);
        student.setScheduleSlot(slot);
        return ResponseEntity.ok(toView(studentRepository.save(student)));
    }

    @PostMapping("/{id}/unenroll")
    public StudentView unenroll(@PathVariable Long id) {
        Student student = ownedStudent(id, currentUser());
        if (student.getScheduleSlot() != null) {
            releaseSlot(student.getScheduleSlot());
            student.setScheduleSlot(null);
            studentRepository.save(student);
        }
        return toView(student);
    }

    private void releaseSlot(ScheduleSlot slot) {
        if (slot.getBooked() != null && slot.getBooked() > 0) {
            slot.setBooked(slot.getBooked() - 1);
            scheduleSlotRepository.save(slot);
        }
    }
}
