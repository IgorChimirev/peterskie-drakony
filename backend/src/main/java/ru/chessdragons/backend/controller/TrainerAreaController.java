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
import ru.chessdragons.backend.dto.TrainerDtos.CreateHomeworkRequest;
import ru.chessdragons.backend.dto.TrainerDtos.CreateTournamentResultRequest;
import ru.chessdragons.backend.model.Homework;
import ru.chessdragons.backend.model.ScheduleSlot;
import ru.chessdragons.backend.model.Student;
import ru.chessdragons.backend.model.Trainer;
import ru.chessdragons.backend.model.TournamentResult;
import ru.chessdragons.backend.model.User;
import ru.chessdragons.backend.repository.HomeworkRepository;
import ru.chessdragons.backend.repository.ScheduleSlotRepository;
import ru.chessdragons.backend.repository.StudentRepository;
import ru.chessdragons.backend.repository.TournamentResultRepository;
import ru.chessdragons.backend.repository.TrainerRepository;
import ru.chessdragons.backend.repository.UserRepository;
import ru.chessdragons.backend.service.NotificationService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/trainer")
@RequiredArgsConstructor
public class TrainerAreaController {

    private final TrainerRepository trainerRepository;
    private final ScheduleSlotRepository scheduleSlotRepository;
    private final StudentRepository studentRepository;
    private final HomeworkRepository homeworkRepository;
    private final TournamentResultRepository tournamentResultRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private Trainer currentTrainer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return trainerRepository.findByUser(user)
                .orElseThrow(() -> new IllegalStateException("У этого пользователя нет карточки тренера"));
    }

    @GetMapping("/me")
    public Trainer me() {
        return currentTrainer();
    }

    @GetMapping("/schedule")
    public List<ScheduleSlot> mySchedule() {
        return scheduleSlotRepository.findByTrainer(currentTrainer());
    }

    @GetMapping("/students")
    public List<Student> myStudents() {
        List<ScheduleSlot> slots = scheduleSlotRepository.findByTrainer(currentTrainer());
        return studentRepository.findByScheduleSlotIn(slots);
    }

    @GetMapping("/homework")
    public List<Homework> homework() {
        return homeworkRepository.findByTrainer(currentTrainer());
    }

    @PostMapping("/homework")
    public ResponseEntity<Homework> addHomework(@Valid @RequestBody CreateHomeworkRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Ученик не найден"));
        Homework homework = Homework.builder()
                .student(student)
                .trainer(currentTrainer())
                .description(request.getDescription())
                .points(request.getPoints())
                .date(LocalDate.now())
                .build();
        Homework saved = homeworkRepository.save(homework);
        if (student.getParent() != null) {
            notificationService.notify(student.getParent(), "Новое домашнее задание",
                    student.getFullName() + ": " + request.getDescription() + " (+" + request.getPoints() + " баллов)");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/tournament-results")
    public List<TournamentResult> tournamentResults() {
        List<ScheduleSlot> slots = scheduleSlotRepository.findByTrainer(currentTrainer());
        return studentRepository.findByScheduleSlotIn(slots).stream()
                .flatMap(s -> tournamentResultRepository.findByStudent(s).stream())
                .toList();
    }

    @PostMapping("/tournament-results")
    public ResponseEntity<TournamentResult> addTournamentResult(@Valid @RequestBody CreateTournamentResultRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Ученик не найден"));
        TournamentResult result = TournamentResult.builder()
                .student(student)
                .tournamentName(request.getTournamentName())
                .place(request.getPlace())
                .points(request.getPoints())
                .date(LocalDate.now())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(tournamentResultRepository.save(result));
    }
}
