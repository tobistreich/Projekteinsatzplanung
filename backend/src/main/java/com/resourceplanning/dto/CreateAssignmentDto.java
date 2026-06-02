package com.resourceplanning.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RegisterForReflection
public class CreateAssignmentDto {
    @NotNull
    private Long employeeId;
    @NotNull
    private Long projectId;
    @NotNull
    private LocalDate startDate;
    private LocalDate endDate;
    @NotNull
    @Positive
    private Integer allocationHoursPerMonth;
    private Boolean billable;
}
