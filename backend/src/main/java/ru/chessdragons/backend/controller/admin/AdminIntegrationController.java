package ru.chessdragons.backend.controller.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.chessdragons.backend.dto.IntegrationDtos.IntegrationStatus;
import ru.chessdragons.backend.model.EmailLog;
import ru.chessdragons.backend.repository.EmailLogRepository;

import java.util.List;

/**
 * Раздел «Интеграции»: показывает реальное состояние внешних интеграций по ТЗ.
 * Сами интеграции (CRM «Мой класс», аналитика, соцсети) сознательно не подключены —
 * это внешние сервисы вне скоупа текущей версии, здесь только видимый статус-плейсхолдер.
 * Email-рассылки — единственная из этой группы, что технически реализована как заглушка
 * (журналируется в EmailLog вместо реальной отправки).
 */
@RestController
@RequestMapping("/api/admin/integrations")
@RequiredArgsConstructor
public class AdminIntegrationController {

    private final EmailLogRepository emailLogRepository;

    @GetMapping
    public List<IntegrationStatus> statuses() {
        return List.of(
                new IntegrationStatus("crm_moyklass", "CRM «Мой класс»", "NOT_CONNECTED",
                        "Требуется API-ключ заказчика из личного кабинета MoyKlass. api.moyklass.com — REST API и вебхуки подтверждены, интеграция не подключена."),
                new IntegrationStatus("analytics", "Системы аналитики (Яндекс.Метрика / GA)", "NOT_CONNECTED",
                        "Счётчик не встроен — нужен ID счётчика заказчика."),
                new IntegrationStatus("social_login", "Вход через соцсети (VK ID)", "NOT_CONNECTED",
                        "OAuth-приложение VK не заведено — на сайте пока только статичные ссылки на сообщества."),
                new IntegrationStatus("email", "Email-рассылки", "STUBBED",
                        "Реальный SMTP не подключён. Письма формируются и логируются во внутреннем журнале (см. ниже) вместо отправки."),
                new IntegrationStatus("sms", "SMS-уведомления/верификация", "STUBBED",
                        "SMS-провайдер не подключён. Коды верификации телефона логируются через тот же журнал вместо реальной отправки.")
        );
    }

    @GetMapping("/emails")
    public List<EmailLog> emailLog() {
        return emailLogRepository.findAll(Sort.by(Sort.Direction.DESC, "sentAt"));
    }
}
