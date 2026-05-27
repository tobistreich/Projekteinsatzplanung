package com.resourceplanning.dto;

import com.resourceplanning.entity.ProjectStatus;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RegisterForReflection
public class ProjectSummaryDto {
    private Long id;
    private String title;
    private ProjectStatus status;
    private List<SkillDto> skills;
    private Integer allocationPercent;
    private Integer allocationHoursPerMonth;
    private Boolean billable;
    private LocalDate startDate;
    private LocalDate endDate;
}
