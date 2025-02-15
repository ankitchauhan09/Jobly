package com.mentorship.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class KafkaEmailTemplate {
    String body;
    String email;
    String subject;
    private LocalDateTime dateTime;
    private ZoneId timeZone;
}
