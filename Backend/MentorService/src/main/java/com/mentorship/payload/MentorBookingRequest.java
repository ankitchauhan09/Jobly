package com.mentorship.payload;

import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class MentorBookingRequest {
    String mentorId;
    Double serviceFee;
    Double amount;
}
