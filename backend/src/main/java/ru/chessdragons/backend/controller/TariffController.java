package ru.chessdragons.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.model.Tariff;
import ru.chessdragons.backend.repository.TariffRepository;

import java.util.List;

@RestController
@RequestMapping("/api/tariffs")
@RequiredArgsConstructor
public class TariffController {

    private final TariffRepository tariffRepository;

    @GetMapping
    public List<Tariff> all() {
        return tariffRepository.findAll(Sort.by("sortOrder"));
    }
}
