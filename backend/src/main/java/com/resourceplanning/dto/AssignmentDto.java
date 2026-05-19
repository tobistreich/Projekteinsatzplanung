package com.resourceplanning.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RegisterForReflection
public class AssignmentDto {
    private Long id;
    private EmployeeSummaryDto employee;
    private ProjectSummaryDto project;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer allocationHoursPerMonth;
    private Boolean billable;
}
