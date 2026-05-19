package com.resourceplanning.dto;

import com.resourceplanning.entity.ProjectStatus;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RegisterForReflection
public class CreateProjectDto {
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatus status;
}
