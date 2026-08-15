package ru.chessdragons.backend.controller.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.dto.ScheduleSlotRequest;
import ru.chessdragons.backend.model.Branch;
import ru.chessdragons.backend.model.ScheduleSlot;
import ru.chessdragons.backend.model.Trainer;
import ru.chessdragons.backend.repository.BranchRepository;
import ru.chessdragons.backend.repository.ScheduleSlotRepository;
import ru.chessdragons.backend.repository.TrainerRepository;

import java.util.List;

@RestController
@RequestMapping("/api/admin/schedule")
@RequiredArgsConstructor
public class AdminScheduleController {

    private final ScheduleSlotRepository scheduleSlotRepository;
    private final BranchRepository branchRepository;
    private final TrainerRepository trainerRepository;

    @GetMapping
    public List<ScheduleSlot> all() {
        return scheduleSlotRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<ScheduleSlot> create(@Valid @RequestBody ScheduleSlotRequest request) {
        ScheduleSlot slot = toEntity(new ScheduleSlot(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(scheduleSlotRepository.save(slot));
    }

    @PutMapping("/{id}")
    public ScheduleSlot update(@PathVariable Long id, @Valid @RequestBody ScheduleSlotRequest request) {
        ScheduleSlot slot = scheduleSlotRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Занятие не найдено"));
        return scheduleSlotRepository.save(toEntity(slot, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        scheduleSlotRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ScheduleSlot toEntity(ScheduleSlot slot, ScheduleSlotRequest request) {
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new IllegalArgumentException("Филиал не найден"));
        Trainer trainer = trainerRepository.findById(request.getTrainerId())
                .orElseThrow(() -> new IllegalArgumentException("Тренер не найден"));

        slot.setGroupName(request.getGroupName());
        slot.setAgeRange(request.getAgeRange());
        slot.setDayOfWeek(request.getDayOfWeek());
        slot.setTimeRange(request.getTimeRange());
        slot.setCapacity(request.getCapacity());
        slot.setBooked(request.getBooked() != null ? request.getBooked() : 0);
        slot.setBranch(branch);
        slot.setTrainer(trainer);
        return slot;
    }
}
