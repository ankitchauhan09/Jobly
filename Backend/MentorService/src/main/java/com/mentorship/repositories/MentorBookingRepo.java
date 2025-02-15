package com.mentorship.repositories;

import com.mentorship.entities.MentorBooking;
import com.mentorship.payload.MentorSessionLoginRequest;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface MentorBookingRepo extends R2dbcRepository<MentorBooking, String> {

    @Modifying
    @Query("INSERT INTO mentor_booking (booking_id,booking_join_pass, user_id, mentor_id, mentor_name, service_name, scheduled_date, booked_time_slot) " +
            "VALUES (:bookingId, :bookingJoinPass, :userId, :mentorId, :mentorName, :serviceName, :scheduledDate, :bookedTimeSlot)")
    Mono<Void> saveCustom(
            @Param("bookingId") String bookingId,
            @Param("bookingJoinPass") Integer bookingJoinPass,
            @Param("userId") String userId,
            @Param("mentorId") String mentorId,
            @Param("mentorName") String mentorName,
            @Param("serviceName") String serviceName,
            @Param("scheduledDate") String scheduledDate,
            @Param("bookedTimeSlot") String bookedTimeSlot
    );

    @Query("SELECT * FROM mentor_booking where user_id = :userId AND mentor_id = :mentorId")
    Flux<MentorBooking> getAllBookings(String userId, String mentorId);

    @Query("SELECT * FROM mentor_booking WHERE booking_id = :#{#mentorSessionLoginRequest.username} AND booking_join_pass = :#{#mentorSessionLoginRequest.password}")
    public Flux<MentorBooking> verifySessionLoginInfo(MentorSessionLoginRequest mentorSessionLoginRequest);

    @Query("DELETE FROM mentor_booking WHERE booking_id = :bookingId")
    Mono<Void> deleteMentorBooking(String bookingId);


    @Query("SELECT * FROM mentor_booking where mentor_id = :mentorI AND service_name = :serviceName")
    Flux<MentorBooking> getAllBookingsByMentorIdAndServiceName(String mentorId, String serviceName);
}