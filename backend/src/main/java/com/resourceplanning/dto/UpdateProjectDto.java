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
public class UpdateProjectDto {
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatus status;
    /** null = Skills unverändert lassen; [] = alle Skills entfernen */
    private List<Long> skillIds;
}
