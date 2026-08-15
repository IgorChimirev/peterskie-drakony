package ru.chessdragons.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.model.ScheduleSlot;
import ru.chessdragons.backend.repository.ScheduleSlotRepository;

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleSlotRepository scheduleSlotRepository;

    @GetMapping
    public List<ScheduleSlot> all() {
        return scheduleSlotRepository.findAll();
    }
}
