package com.paymentservice.service;

import com.paymentservice.payload.PaymentLogDetail;
import com.paymentservice.payload.PaymentVerificationRequest;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class RazorPayPaymentService {

    @Value("${razorpay.key_id}")
    private String keyId;
    @Value("${razorpay.key_secret}")
    private String keySecret;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    public Map<String, Object> createOrder(Double amount) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "receipt#1");
        JSONObject notes = new JSONObject();
        notes.put("notes_key_1", "Tea, Earl Grey, Hot");
        orderRequest.put("notes", notes);

        Order order = razorpay.orders.create(orderRequest);
        log.info("order created : {}", order);

        // Convert Order to Map for proper JSON serialization
        Map<String, Object> response = new HashMap<>();
        response.put("order_id", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));
        response.put("receipt", order.get("receipt"));
        return response;
    }

    public Boolean verifyPayment(PaymentVerificationRequest request) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", request.getOrderId());
            attributes.put("razorpay_payment_id", request.getPaymentId());
            attributes.put("razorpay_signature", request.getSignature());

            // Verify signature using Razorpay Utils
            boolean isValidSignature = Utils.verifyPaymentSignature(attributes, keySecret);
            if (isValidSignature) {
                log.info("Payment done successfully : {}", request.getPaymentId());
                PaymentLogDetail paymentLogDetail = new PaymentLogDetail();
                paymentLogDetail.setPaymentId(request.getPaymentId());
                paymentLogDetail.setOrderId(request.getOrderId());
                paymentLogDetail.setSignature(request.getSignature());
                paymentLogDetail.setCurrency(request.getCurrency());
                paymentLogDetail.setAmount(request.getAmount());
                kafkaProducerService.sendPaymentLogToKafka(paymentLogDetail)
                        .map(status -> {
                            if (status) {
                                log.info("Payment successfully : {}", request.getPaymentId());
                            } else {
                                log.info("Payment failed : {}", request.getPaymentId());
                            }
                            return Mono.just(status);
                        });
            }
            return isValidSignature;
        } catch (Exception e) {
            return false;
        }
    }

}
