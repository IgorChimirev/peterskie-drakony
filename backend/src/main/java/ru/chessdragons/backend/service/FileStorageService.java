package ru.chessdragons.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Локальное хранение файлов на диске сервера (без внешних объектных хранилищ вроде S3 —
 * для демо-масштаба этого достаточно, папка uploads/ отдаётся статикой).
 */
@Service
public class FileStorageService {

    private final Path root = Path.of("uploads");

    public String store(MultipartFile file) {
        try {
            Files.createDirectories(root);
            String extension = "";
            String original = file.getOriginalFilename();
            if (original != null && original.contains(".")) {
                extension = original.substring(original.lastIndexOf('.'));
            }
            String fileName = UUID.randomUUID() + extension;
            Path target = root.resolve(fileName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + fileName;
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
