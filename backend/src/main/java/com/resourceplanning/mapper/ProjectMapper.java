package com.resourceplanning.mapper;

import com.resourceplanning.dto.ProjectDto;
import com.resourceplanning.entity.Project;
import org.mapstruct.Mapper;

@Mapper(componentModel = "jakarta-cdi", uses = SkillMapper.class)
public interface ProjectMapper {
    ProjectDto toDto(Project project);
}
