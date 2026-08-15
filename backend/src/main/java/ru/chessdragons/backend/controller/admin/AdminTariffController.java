package ru.chessdragons.backend.controller.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.model.Tariff;
import ru.chessdragons.backend.repository.TariffRepository;

@RestController
@RequestMapping("/api/admin/tariffs")
@RequiredArgsConstructor
public class AdminTariffController {

    private final TariffRepository tariffRepository;

    @PostMapping
    public ResponseEntity<Tariff> create(@Valid @RequestBody Tariff tariff) {
        tariff.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(tariffRepository.save(tariff));
    }

    @PutMapping("/{id}")
    public Tariff update(@PathVariable Long id, @Valid @RequestBody Tariff tariff) {
        tariff.setId(id);
        return tariffRepository.save(tariff);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tariffRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
