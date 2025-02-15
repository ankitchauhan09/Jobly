package com.mentorship.payload;

import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class RazorpayPaymentResponse {
    String orderId;
    String paymentId;
    String signature;
    String userId;
    Integer serviceId;
    String timeSlotBooked;
    String mentorId;
    String mentorName;
    String scheduledDate;
    String amount;
    String userEmail;
}
