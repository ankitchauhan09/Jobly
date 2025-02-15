package com.paymentservice.controller;

import com.paymentservice.payload.OrderRequest;
import com.paymentservice.payload.PaymentVerificationRequest;
import com.paymentservice.service.RazorPayPaymentService;
import com.razorpay.RazorpayException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payment")
@Slf4j
@CrossOrigin(
        originPatterns = "*",
        allowCredentials = "true"
)
public class PaymentController {

    @Autowired
    private RazorPayPaymentService razorPayPaymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest amount) throws RazorpayException {
        return ResponseEntity.ok().body(razorPayPaymentService.createOrder(amount.getAmount()));
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateOrder(@RequestBody PaymentVerificationRequest request) throws RazorpayException {
        if (request.getAmount() != null && !request.getAmount().trim().isEmpty()) {
            log.info("received request: {}", request);
            Boolean status = razorPayPaymentService.verifyPayment(request);
            Map<String, Object> response = new HashMap<>();
            response.put("paymentStatus", status);
            log.info("paymentStatus : {}", status);
            return ResponseEntity.ok(response);
        } else {
            log.warn("Invalid request: amount is null or empty");
            return ResponseEntity.badRequest().body("Amount is null or empty");
        }
    }

}
