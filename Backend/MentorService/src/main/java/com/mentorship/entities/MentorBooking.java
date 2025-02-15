package com.mentorship.entities;


import lombok.Data;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@ToString
@Data
@Table("mentor_booking")
public class MentorBooking {

    @Id
    @Column("booking_id")
    private String bookingId;

    @Column("booking_join_pass")
    private String bookingJoinPass;

    @Column("user_id")
    private String userId;

    @Column("mentor_id")
    private String mentorId;

    @Column("mentor_name")
    private String mentorName;

    @Column("service_name")
    private String serviceName;

    @Column("scheduled_date")
    private String scheduledDate;

    @Column("booked_time_slot")
    private String bookedTimeSlot;

}
