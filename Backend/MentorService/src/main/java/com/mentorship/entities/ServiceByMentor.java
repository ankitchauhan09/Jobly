package com.mentorship.entities;

import lombok.Data;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("mentor_services")
@ToString
@Data
public class ServiceByMentor {
    @Id
    @Column("service_id")
    Integer serviceId;
    @Column("serviceName")
    String serviceName;
    @Column("serviceDescription")
    String serviceDescription;
    @Column("mentorId")
    String mentorId;
}
