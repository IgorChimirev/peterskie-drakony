package ru.chessdragons.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

/**
 * Реальное локальное резервное копирование БД через встроенную команду H2 `BACKUP TO` —
 * создаёт консистентный zip-снимок без остановки сервера. На управляемом Postgres в проде
 * за это обычно отвечает хостинг/СУБД (pg_dump по расписанию) — здесь показан рабочий локальный вариант.
 */
@Service
@RequiredArgsConstructor
public class BackupService {

    private final DataSource dataSource;
    private final Path backupsDir = Path.of("backups");
    private static final DateTimeFormatter STAMP = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");

    public record BackupFile(String name, long sizeBytes, long createdAtEpochMs) {
    }

    public BackupFile createBackup() {
        try {
            Files.createDirectories(backupsDir);
            String name = "chessdragons-" + LocalDateTime.now().format(STAMP) + ".zip";
            Path target = backupsDir.resolve(name);

            try (Connection connection = dataSource.getConnection();
                 Statement statement = connection.createStatement()) {
                statement.execute("BACKUP TO '" + target.toAbsolutePath() + "'");
            }

            return new BackupFile(name, Files.size(target), Files.getLastModifiedTime(target).toMillis());
        } catch (SQLException e) {
            throw new IllegalStateException("Не удалось создать резервную копию: " + e.getMessage(), e);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public List<BackupFile> list() {
        try {
            if (!Files.exists(backupsDir)) return List.of();
            try (var stream = Files.list(backupsDir)) {
                return stream
                        .map(p -> {
                            try {
                                return new BackupFile(p.getFileName().toString(), Files.size(p),
                                        Files.getLastModifiedTime(p).toMillis());
                            } catch (IOException e) {
                                throw new UncheckedIOException(e);
                            }
                        })
                        .sorted(Comparator.comparingLong(BackupFile::createdAtEpochMs).reversed())
                        .toList();
            }
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
