package com.resourceplanning.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RegisterForReflection
public class TeamDto {
    private Long id;
    private String name;
    private EmployeeSummaryDto teamLead;
}
