package com.resourceplanning.mapper;

import com.resourceplanning.dto.EmployeeSummaryDto;
import com.resourceplanning.entity.Employee;
import org.mapstruct.Mapper;

@Mapper(componentModel = "jakarta-cdi", uses = SkillMapper.class)
public interface EmployeeSummaryMapper {
    EmployeeSummaryDto toDto(Employee employee);
}
