package com.resourceplanning.dto;

import com.resourceplanning.entity.ProjectStatus;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RegisterForReflection
public class ProjectSummaryDto {
    private Long id;
    private String title;
    private ProjectStatus status;
}
