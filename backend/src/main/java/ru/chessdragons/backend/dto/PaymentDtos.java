package ru.chessdragons.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ru.chessdragons.backend.model.Payment;
import ru.chessdragons.backend.model.Subscription;

public class PaymentDtos {

    @Data
    public static class CheckoutRequest {
        @NotNull
        private Long studentId;
        @NotNull
        private Long tariffId;
    }

    @Data
    public static class CheckoutResponse {
        private final Payment payment;
        private final Subscription subscription;
    }
}
