package com.mentorship.service;

import com.mentorship.dto.MentorDto;
import com.mentorship.entities.MentorBooking;
import com.mentorship.kafka.EmailKafkaProducer;
import com.mentorship.payload.*;
import com.mentorship.repositories.MentorBookingRepo;
import com.mentorship.repositories.MentorRepo;
import com.mentorship.repositories.MentorServiceRepo;
import com.mentorship.utils.CustomIdGenerator;
import com.mentorship.utils.CustomModelMapper;
import com.mentorship.utils.EMAIL_TEMPLATE;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.View;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class MentorService {

    @Autowired
    private MentorRepo mentorRepo;
    @Autowired
    private MentorBookingRepo mentorBookingRepo;
    @Autowired
    private MentorServiceRepo serviceRepo;
    @Autowired
    private EmailKafkaProducer emailKafkaProducer;
    @Autowired
    private View error;

    private final WebClient paymentServiceClient;

    public MentorService() {
        paymentServiceClient = WebClient.builder().baseUrl("http://localhost:8099/payment").build();
    }

    public Mono<Map<String, Object>> verifySessionLogin(MentorSessionLoginRequest mentorSessionLoginRequest) {
        return Mono.just(mentorSessionLoginRequest)
                .flatMap(a -> {
                    return mentorBookingRepo.verifySessionLoginInfo(mentorSessionLoginRequest)
                            .collectList()
                            .map(lists -> {
                                Map<String, Object> map = new HashMap<>();
                                if (!lists.isEmpty() || lists.size() >= 1) {
                                    map.put("status", true);
                                    map.put("job_booking_dto", lists.get(0));
                                    return map;
                                } else {
                                    map.put("status", false);
                                    return map;
                                }
                            })
                            .doOnSuccess(success -> log.info("Successfully verified the session login info"));
                })
                .defaultIfEmpty(Map.of("status", false))
                .onErrorReturn(Map.of("status", false));

    }

    public Mono<MentorDto> registerNewMentor(MentorDto mentorDto) throws Exception {
        return Mono.just(mentorDto)
                .map(CustomModelMapper::toEntity)
                .flatMap(mentor -> {
                    mentor.setId(CustomIdGenerator.generateStringId(8));
                    return mentorRepo.save(mentor)
                            .then(Mono.just(mentor))
                            .doOnSuccess(savedMentor -> log.info("mentor saved successfully {}", savedMentor))
                            .doOnError(error -> log.error("error while saving the mentor : {}", error.getMessage()));
                }).map(CustomModelMapper::toDto)
                .doOnSuccess(savedMentor -> log.info("mentor registered successfully , {}", savedMentor))
                .doOnError(error -> log.error("error while saving the mentor : {}", error.getMessage()));
    }

    public Mono<MentorDto> getMentor(String mentorId) throws Exception {
        return Mono.just(mentorId)
                .flatMap(id -> {
                    return mentorRepo.findById(mentorId)
                            .map(CustomModelMapper::toDto)
                            .doOnSuccess(fetchedMentor -> log.info("mentor fetched successfully {}", fetchedMentor))
                            .doOnError(error -> log.error("error while fetching the mentor : {}", error.getMessage()));
                });
    }

    public Flux<MentorDto> getAllMentors() throws Exception {
        return mentorRepo.findAll().map(CustomModelMapper::toDto);
    }

    public Mono<RazorpayOrder> bookMentorService(MentorBookingRequest request) {
        if (request.getServiceFee() <= 0) {
            return Mono.error(new IllegalArgumentException("Invalid service fee."));
        }
        return paymentServiceClient.post()
                .uri("/create-order")
                .bodyValue(Map.of(
                        "amount", request.getAmount()
                ))
                .retrieve()
                .bodyToMono(RazorpayOrder.class);
    }

    public Mono<Boolean> verifyServicePayment(RazorpayPaymentResponse response) {
        if (response == null) {
            return Mono.error(new IllegalArgumentException("Invalid response"));
        }

        return paymentServiceClient.post()
                .uri("/validate")
                .bodyValue(Map.of(
                        "orderId", response.getOrderId(),
                        "paymentId", response.getPaymentId(),
                        "signature", response.getSignature(),
                        "amount", response.getAmount(),
                        "currency", "INR"
                ))
                .retrieve()
                .bodyToMono(Map.class)
                .flatMap(validationResult -> {
                    log.info("Payment Validation Result: {}", validationResult);

                    // Check for explicit payment status
                    Object paymentStatus = validationResult.get("paymentStatus");
                    boolean isPaymentVerified = Boolean.TRUE.equals(paymentStatus);

                    log.info("Payment Verification Status: {}", isPaymentVerified);

                    if (isPaymentVerified) {
                        return saveTransactionDetails(response)
                                .thenReturn(true)
                                .doOnSuccess(success -> log.info("Transaction saved and verified successfully"))
                                .doOnError(error -> {
                                    log.error("Error saving transaction details", error);
                                });
                    } else {
                        log.warn("Payment verification failed. Detailed result: {}", validationResult);
                        return Mono.just(false);
                    }
                })
                .onErrorResume(error -> {
                    log.error("Error during payment verification", error);
                    return Mono.just(false);
                });
    }

    private Mono<Void> saveTransactionDetails(RazorpayPaymentResponse response) {
        log.info("Saving transaction details: {}", response);
        String bookingId = CustomIdGenerator.generateAlphanumericIdOrPassword(6);
        Integer bookingJoinPass = CustomIdGenerator.generateIntegerId(6);
        return serviceRepo.findById(response.getServiceId())
                .flatMap(fetchedService -> {
                    String serviceName = (fetchedService != null)
                            ? fetchedService.getServiceName()
                            : "null service";

                    log.info("Preparing to save mentor booking with ID: {}", bookingId);

                    return mentorBookingRepo.saveCustom(
                                    bookingId,
                                    bookingJoinPass,
                                    response.getUserId(),
                                    response.getMentorId(),
                                    response.getMentorName(),
                                    serviceName,
                                    response.getScheduledDate(),
                                    response.getTimeSlotBooked()
                            )
                            .doOnSuccess(success -> {
                                log.info("Mentor booking saved successfully with ID: {}", bookingId);
                                if (response.getUserEmail() != null && !response.getUserEmail().isEmpty()) {
                                    KafkaEmailTemplate kafkaEmailTemplate = KafkaEmailTemplate.builder()
                                            .subject("Mentor Booked Successfully")
                                            .email(response.getUserEmail())
                                            .body("Your session with mentor " + response.getMentorName() + " has been booked successfully you will shortly receive a mail with username and password using which you can join the session..\nRegards Jobly")
                                            .dateTime(LocalDateTime.now())
                                            .timeZone(ZoneId.systemDefault())
                                            .build();
                                    sendConfirmationEmailToUser(kafkaEmailTemplate);

                                    KafkaEmailTemplate userAndPassTemplate = KafkaEmailTemplate.builder()
                                            .subject("Jobly mentor session join info")
                                            .email(response.getUserEmail())
                                            .body(EMAIL_TEMPLATE.getSessionJoinDetailTemplate(bookingId, bookingJoinPass))
//                                            .dateTime(LocalDateTime.now().plusDays(1).with(LocalTime.of(17, 0)))
                                            .dateTime(LocalDateTime.now().plusMinutes(1))
                                            .timeZone(ZoneId.systemDefault())
                                            .build();
                                    sendSessionJoinInfoToUser(userAndPassTemplate);
                                }
                            })
                            .doOnError(error -> {
                                log.error("Error saving mentor booking: {}", error.getMessage(), error);
                                throw new RuntimeException("Failed to save mentor booking", error);
                            });
                })
                .doOnError(error -> {
                    log.error("Error in save transaction details: {}", error.getMessage(), error);
                    throw new RuntimeException("Failed to process transaction details", error);
                });
    }

    void sendSessionJoinInfoToUser(KafkaEmailTemplate kafkaEmailTemplate) {
        emailKafkaProducer.sendScheduledEmail(kafkaEmailTemplate);
    }

    void sendConfirmationEmailToUser(KafkaEmailTemplate kafkaEmailTemplate) {
        emailKafkaProducer.sendEmail(kafkaEmailTemplate);
    }

    public Mono<Boolean> deleteMentor(String mentorId) {
        return mentorRepo.findById(mentorId)
                .flatMap(mentor -> mentorRepo.deleteById(mentorId)
                        .then(Mono.just(true))
                        .doOnSuccess(success -> log.info("Mentor deleted successfully with id: {}", mentorId))
                )
                .defaultIfEmpty(false)
                .onErrorReturn(false)
                .doOnError(error -> log.error("Error while deleting mentor: {}", error.getMessage()));
    }

    public Flux<MentorBooking> getAllBookings(String userId, String mentorId) {
        return mentorBookingRepo.getAllBookings(userId, mentorId);
    }

    public Mono<Boolean> isBooked(String mentorId, Integer serviceId) {
        return serviceRepo.findById(serviceId)
                .flatMap(fetchedService -> {
                            String serviceName = (fetchedService != null)
                                    ? fetchedService.getServiceName()
                                    : "null service";

                            return mentorBookingRepo.getAllBookingsByMentorIdAndServiceName(mentorId, serviceName)
                                    .collectList()
                                    .map(allBookings -> {
                                        log.info("allbookings: {}", allBookings);
                                        return !allBookings.isEmpty();
                                    });
                        }
                );
    }

    public Mono<Boolean> deleteMentorBookingSession(String bookingId) {
        log.info("Attempting to delete mentor booking with ID: {}", bookingId);
        return mentorBookingRepo.deleteMentorBooking(bookingId)
                .thenReturn(true) // Return true if deletion is successful
                .doOnSuccess(success -> log.info("Mentor booking deleted successfully with ID: {}", bookingId))
                .doOnError(error -> log.error("Error occurred while deleting mentor booking with ID: {}: {}", bookingId, error.getMessage()))
                .onErrorReturn(false); // Return false in case of an error
    }
}
