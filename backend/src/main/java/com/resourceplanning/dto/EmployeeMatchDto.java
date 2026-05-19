package com.resourceplanning.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RegisterForReflection
public class EmployeeMatchDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String jobTitle;
    private Integer monthlyCapacityHours;
    private List<SkillDto> skills;
    private List<SkillDto> matchedSkills;
    private int matchedSkillsCount;
    private int totalProjectSkillsCount;
    private int minRemainingCapacityHours;
}
