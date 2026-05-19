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
public class ProjectDto {
    private Long id;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatus status;
    private List<SkillDto> skills;
}
