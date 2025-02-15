package com.sih.hexstar.user.payloads;

import lombok.Data;

import java.util.List;

@Data
public class Education {
    private String college;
    private String university;
    private String grade;
    private String degree;
    private String course;
    private List<String> activities;
}
