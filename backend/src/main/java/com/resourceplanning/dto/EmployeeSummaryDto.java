package com.resourceplanning.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RegisterForReflection
public class EmployeeSummaryDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String jobTitle;
    private List<SkillDto> skills;
}
