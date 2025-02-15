package com.mentorship.payload;

import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class RazorpayOrder {
    String order_id ;
    Double amount;
    String receipt;
    String currency;
}
