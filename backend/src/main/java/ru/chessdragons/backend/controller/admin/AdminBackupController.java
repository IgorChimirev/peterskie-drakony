package ru.chessdragons.backend.controller.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.service.BackupService;
import ru.chessdragons.backend.service.BackupService.BackupFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/backup")
@RequiredArgsConstructor
public class AdminBackupController {

    private final BackupService backupService;

    @GetMapping
    public List<BackupFile> list() {
        return backupService.list();
    }

    @PostMapping
    public BackupFile create() {
        return backupService.createBackup();
    }
}
