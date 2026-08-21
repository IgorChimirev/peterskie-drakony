package ru.chessdragons.backend.controller.admin;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.chessdragons.backend.service.FileStorageService;

@RestController
@RequestMapping("/api/admin/media")
@RequiredArgsConstructor
public class AdminFileController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public UploadResponse upload(@RequestParam("file") MultipartFile file) {
        return new UploadResponse(fileStorageService.store(file));
    }

    @Data
    public static class UploadResponse {
        private final String url;
    }
}
