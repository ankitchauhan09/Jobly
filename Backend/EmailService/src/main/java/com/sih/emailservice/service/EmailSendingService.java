package com.sih.emailservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.sih.emailservice.payload.EmailRequest;
import com.sih.emailservice.quartz.job.EmailJob;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.scheduler.Schedulers;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.kafka.receiver.ReceiverRecord;

import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.Date;
import java.util.UUID;

@Service
@Slf4j
public class EmailSendingService {

    @Autowired
    private ReceiverOptions<String, String> receiverOptions;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    @Autowired
    private Scheduler scheduler;
    @Autowired
    private EmailSender emailSender;

    @PostConstruct
    private void init() {
        handleIncomingScheduledEmailRequest();
        handleIncomingDirectEmailRequest();
    }

    private void handleIncomingDirectEmailRequest() {
        KafkaReceiver.create(receiverOptions.subscription(Collections.singleton("email-instant")))
                .receive()
                .publishOn(Schedulers.parallel())
                .doOnNext(this::sendInstantMail)
                .doOnError(this::handleError)
                .subscribe();
    }

    private void sendInstantMail(ReceiverRecord<String, String> record) {
        try {
            EmailRequest emailRequest = objectMapper.readValue(record.value(), EmailRequest.class);
            log.info("emailRequest : {}", emailRequest);
            emailSender.sendMail(emailRequest.getEmail(), emailRequest.getSubject(), emailRequest.getBody());
        } catch (IOException e) {
            log.error("error occurred while converting the message to email request : {}", e.getMessage());
        }
    }

    public void handleIncomingScheduledEmailRequest() {
        KafkaReceiver.create(receiverOptions.subscription(Collections.singleton("email-scheduled")))
                .receive()
                .publishOn(Schedulers.parallel())
                .doOnNext(this::sendScheduledMail)
                .doOnError(this::handleError)
                .subscribe();
    }

    private void handleError(Throwable throwable) {
        log.error("Error received while receiving emails from the kafka topic : {}", throwable.getMessage());
    }

    private void sendScheduledMail(ReceiverRecord<String, String> record) {
        try {
            EmailRequest emailRequest = objectMapper.readValue(record.value(), EmailRequest.class);
            log.info("emailRequest : {}", emailRequest);

            ZonedDateTime startAt = ZonedDateTime.of(emailRequest.getDateTime(), emailRequest.getTimeZone());
            if (startAt.isBefore(ZonedDateTime.now())) {
                log.error("Invalid scheduled date for the email..");
                return;
            }

            JobDetail jobDetail = buildJobDetail(emailRequest);
            Trigger trigger = buildTrigger(jobDetail, startAt);

            scheduler.scheduleJob(jobDetail, trigger);

        } catch (IOException e) {
            log.error("error occurred while converting the message to email request : {}", e.getMessage());
        } catch (SchedulerException e) {
            log.error("Error occurred while scheduling the job : {}", e.getMessage());
        }
    }

    private JobDetail buildJobDetail(EmailRequest emailRequest) {
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("email", emailRequest.getEmail());
        jobDataMap.put("subject", emailRequest.getSubject());
        jobDataMap.put("body", emailRequest.getBody());

        return JobBuilder.newJob(EmailJob.class)
                .setJobData(jobDataMap)
                .withIdentity(UUID.randomUUID().toString())
                .storeDurably()
                .withDescription("Creating the job for sending email")
                .build();
    }

    private Trigger buildTrigger(JobDetail jobDetail, ZonedDateTime startAt) {
        return TriggerBuilder.newTrigger()
                .withIdentity(jobDetail.getKey().getName())
                .withDescription("Creating trigger for the job")
                .forJob(jobDetail)
                .startAt(Date.from(startAt.toInstant()))
                .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
                .build();
    }
}
