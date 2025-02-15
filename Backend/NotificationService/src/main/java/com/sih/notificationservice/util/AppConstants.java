package com.sih.notificationservice.util;

import java.util.Set;

public class AppConstants {
    public static final String PAYMENT_LOG_TOPIC = "payment-log-topic";
    public static final String GROUP_ID = "group-1";
    public static final Set<String> ALL_TOPICS = Set.of("payment-log-topic", "user-topic");
}
