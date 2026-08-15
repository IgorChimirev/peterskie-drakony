package ru.chessdragons.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.model.Lead;
import ru.chessdragons.backend.repository.LeadRepository;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadRepository leadRepository;

    @PostMapping
    public ResponseEntity<Lead> create(@Valid @RequestBody Lead lead) {
        lead.setId(null);
        lead.setCreatedAt(LocalDateTime.now());
        Lead saved = leadRepository.save(lead);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
