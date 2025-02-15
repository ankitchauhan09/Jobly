package com.paymentservice.payload;


import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class OrderRequest {
    Double amount;
}
