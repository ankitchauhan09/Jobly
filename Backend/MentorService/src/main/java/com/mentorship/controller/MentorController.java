package com.mentorship.controller;

import com.mentorship.dto.MentorDto;
import com.mentorship.entities.MentorBooking;
import com.mentorship.payload.MentorBookingRequest;
import com.mentorship.payload.MentorSessionLoginRequest;
import com.mentorship.payload.RazorpayOrder;
import com.mentorship.payload.RazorpayPaymentResponse;
import com.mentorship.service.MentorService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/mentor")
@Slf4j
public class MentorController {

    @Autowired
    private MentorService mentorService;

    @PostMapping("/register")
    public Mono<MentorDto> registerMentor(@RequestBody MentorDto mentorDto) {
        try {
            return mentorService.registerNewMentor(mentorDto);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/{id}")
    public Mono<MentorDto> getMentorById(@PathVariable String id) {
        try {
            return mentorService.getMentor(id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/")
    public Flux<MentorDto> getAllMentors() {
        try {
            return mentorService.getAllMentors();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/payment/service")
    public Mono<RazorpayOrder> payForService(@RequestBody MentorBookingRequest mentorBookingRequest) {
        return this.mentorService.bookMentorService(mentorBookingRequest)
                .doOnError(error -> log.error("Error while paying the mentor for following request : {}", mentorBookingRequest));
    }

    @PostMapping("/session/login")
    public Mono<Map<String, Object>> login(@RequestBody MentorSessionLoginRequest mentorSessionLoginRequest) {
        return this.mentorService.verifySessionLogin(mentorSessionLoginRequest)
                .doOnError(error -> log.error("Error while logining the mentor : {}", mentorSessionLoginRequest));

    }

    @DeleteMapping("/session/delete/{bookingId}")
    public Mono<Boolean> deleteMentorSession(@PathVariable("bookingId") String bookingId) {
        return   this.mentorService.deleteMentorBookingSession(bookingId);
    }


    @PostMapping("/payment/validate")
    public Mono<Map<String, Object>> validatePayment(@RequestBody RazorpayPaymentResponse request) {
        log.info("Received payment validation request: {}", request);

        return mentorService.verifyServicePayment(request)
                .map(isValid -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("paymentStatus", isValid);
                    log.info("Payment validation result: {}", isValid);
                    return response;
                })
                .doOnError(error -> log.error("Payment validation error", error));
    }

    @GetMapping("/service/isBooked/{mentorId}/{serviceId}")
    public Mono<Boolean> isBooked(@PathVariable String mentorId, @PathVariable Integer serviceId) {
        return mentorService.isBooked(mentorId, serviceId);
    }


    @GetMapping("/all-bookings/{userId}/{mentorId}")
    public Flux<MentorBooking> getAllBookings(@PathVariable("userId") String userId, @PathVariable("mentorId") String mentorId) {
        return mentorService.getAllBookings(userId, mentorId);
    }

    @DeleteMapping("/{id}")
    public Mono<Boolean> deleteMentor(@PathVariable String id) {
        try {
            return mentorService.deleteMentor(id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
