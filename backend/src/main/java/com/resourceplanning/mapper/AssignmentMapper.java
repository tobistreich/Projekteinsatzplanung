package com.resourceplanning.mapper;

import com.resourceplanning.dto.AssignmentDto;
import com.resourceplanning.entity.Assignment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "jakarta-cdi", uses = EmployeeSummaryMapper.class)
public interface AssignmentMapper {
    @Mapping(target = "project.skills",                   ignore = true)
    @Mapping(target = "project.allocationPercent",         ignore = true)
    @Mapping(target = "project.allocationHoursPerMonth",   ignore = true)
    @Mapping(target = "project.billable",                  ignore = true)
    @Mapping(target = "project.startDate",                 ignore = true)
    @Mapping(target = "project.endDate",                   ignore = true)
    AssignmentDto toDto(Assignment assignment);
}
