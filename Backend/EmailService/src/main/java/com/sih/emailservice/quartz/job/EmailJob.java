package com.sih.emailservice.quartz.job;

import com.sih.emailservice.EmailServiceApplication;
import com.sih.emailservice.service.EmailSender;
import lombok.extern.slf4j.Slf4j;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class EmailJob extends QuartzJobBean {


    @Autowired
    private EmailServiceApplication emailServiceApplication;

    @Autowired
    private EmailSender emailSender;

    @Override
    protected void executeInternal(JobExecutionContext context) throws JobExecutionException {
        JobDataMap jobDataMap = context.getMergedJobDataMap();
        String recipientEmail = jobDataMap.getString("email");
        String subject = jobDataMap.getString("subject");
        String body = jobDataMap.getString("body");

        emailSender.sendMail(recipientEmail, subject, body);
    }


}
