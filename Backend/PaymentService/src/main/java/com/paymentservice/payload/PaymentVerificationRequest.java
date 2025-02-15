package com.paymentservice.payload;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class PaymentVerificationRequest {
    String orderId;
    String paymentId;
    String signature;
    String amount;
    String currency;
}
