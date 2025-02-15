package com.skillservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SkillDto {
    private Integer id;
    private String skillName;
    private String skillDescription;
}
