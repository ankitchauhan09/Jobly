package com.paymentservice.payload;

import lombok.Data;

@Data
public class PaymentLogDetail {
    String orderId;
    String paymentId;
    String currency;
    String amount;
    String signature;
}
