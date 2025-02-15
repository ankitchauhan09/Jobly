package com.mentorship.entities;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class Certificates {
    private String title;
    private String issuerOrganization;
    private String certificateUrl;
    private String issuedDate;

}
