package com.resourceplanning.mapper;

import com.resourceplanning.dto.EmployeeDto;
import com.resourceplanning.entity.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mappt strukturelle Employee-Felder. Berechnete Metriken (availabilityPercent etc.)
 * und projects werden bewusst ignoriert — sie enthalten Business-Logik, die im
 * EmployeeService verbleibt und nach dem Mapper-Aufruf gesetzt wird.
 */
@Mapper(componentModel = "jakarta-cdi", uses = {SkillMapper.class, TeamMapper.class})
public interface EmployeeMapper {
    @Mapping(target = "utilizationPercent",      ignore = true)
    @Mapping(target = "allocatedHours",         ignore = true)
    @Mapping(target = "billablePercent",        ignore = true)
    @Mapping(target = "billableAllocatedHours", ignore = true)
    @Mapping(target = "internalPercent",        ignore = true)
    @Mapping(target = "internalAllocatedHours", ignore = true)
    @Mapping(target = "projects",               ignore = true)
    EmployeeDto toBaseDto(Employee employee);
}
