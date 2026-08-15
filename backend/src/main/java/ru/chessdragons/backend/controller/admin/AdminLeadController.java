package ru.chessdragons.backend.controller.admin;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.model.Lead;
import ru.chessdragons.backend.repository.LeadRepository;

import java.util.List;

@RestController
@RequestMapping("/api/admin/leads")
@RequiredArgsConstructor
public class AdminLeadController {

    private final LeadRepository leadRepository;

    @GetMapping
    public List<Lead> all() {
        return leadRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @PatchMapping("/{id}")
    public Lead updateStatus(@PathVariable Long id, @RequestBody StatusRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Заявка не найдена"));
        lead.setStatus(request.getStatus());
        return leadRepository.save(lead);
    }

    @Data
    public static class StatusRequest {
        private String status;
    }
}
