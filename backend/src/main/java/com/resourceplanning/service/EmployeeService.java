package com.resourceplanning.service;

import com.resourceplanning.dto.*;
import com.resourceplanning.entity.Assignment;
import com.resourceplanning.entity.Employee;
import com.resourceplanning.entity.Skill;
import com.resourceplanning.entity.Team;
import com.resourceplanning.repository.AssignmentRepository;
import com.resourceplanning.repository.EmployeeRepository;
import com.resourceplanning.repository.SkillRepository;
import com.resourceplanning.repository.TeamRepository;
import java.time.LocalDate;
import java.time.YearMonth;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;

@ApplicationScoped
public class EmployeeService {

    @Inject
    EmployeeRepository employeeRepository;

    @Inject
    TeamRepository teamRepository;

    @Inject
    SkillRepository skillRepository;

    @Inject
    AssignmentRepository assignmentRepository;

    @Transactional
    public List<EmployeeDto> getAll() {
        return employeeRepository.listAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public EmployeeDto getById(Long id) {
        return employeeRepository.findByIdOptional(id)
                .map(this::toDto)
                .orElseThrow(() -> new NotFoundException("Employee not found: " + id));
    }

    @Transactional
    public EmployeeDto create(CreateEmployeeDto dto) {
        Employee employee = Employee.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .jobTitle(dto.getJobTitle())
                .monthlyCapacityHours(dto.getMonthlyCapacityHours())
                .build();
        if (dto.getTeamId() != null) {
            Team team = teamRepository.findByIdOptional(dto.getTeamId())
                    .orElseThrow(() -> new NotFoundException("Team not found: " + dto.getTeamId()));
            employee.setTeam(team);
        }
        employeeRepository.persist(employee);
        return toDto(employee);
    }

    @Transactional
    public EmployeeDto update(Long id, UpdateEmployeeDto dto) {
        Employee employee = employeeRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Employee not found: " + id));
        if (dto.getFirstName() != null) employee.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) employee.setLastName(dto.getLastName());
        if (dto.getJobTitle() != null) employee.setJobTitle(dto.getJobTitle());
        if (dto.getMonthlyCapacityHours() != null) employee.setMonthlyCapacityHours(dto.getMonthlyCapacityHours());
        if (dto.getTeamId() != null) {
            Team team = teamRepository.findByIdOptional(dto.getTeamId())
                    .orElseThrow(() -> new NotFoundException("Team not found: " + dto.getTeamId()));
            employee.setTeam(team);
        }
        if (dto.getSkillIds() != null) {
            List<Skill> skills = dto.getSkillIds().stream()
                    .map(sid -> skillRepository.findByIdOptional(sid)
                            .orElseThrow(() -> new NotFoundException("Skill not found: " + sid)))
                    .toList();
            employee.getSkills().clear();
            employee.getSkills().addAll(skills);
        }
        return toDto(employee);
    }

    @Transactional
    public void delete(Long id) {
        if (!employeeRepository.deleteById(id)) {
            throw new NotFoundException("Employee not found: " + id);
        }
    }

    private EmployeeDto toDto(Employee employee) {
        TeamSummaryDto teamDto = null;
        if (employee.getTeam() != null) {
            teamDto = TeamSummaryDto.builder()
                    .id(employee.getTeam().getId())
                    .name(employee.getTeam().getName())
                    .build();
        }
        List<SkillDto> skills = employee.getSkills().stream()
                .map(s -> SkillDto.builder().id(s.getId()).name(s.getName()).build())
                .toList();

        LocalDate monthStart = YearMonth.now().atDay(1);
        LocalDate monthEnd = YearMonth.now().atEndOfMonth();

        List<Assignment> activeAssignments = assignmentRepository.findByEmployeeId(employee.getId())
                .stream()
                .filter(a -> !a.getStartDate().isAfter(monthEnd) && !a.getEndDate().isBefore(monthStart))
                .toList();

        int totalAllocated = activeAssignments.stream()
                .mapToInt(a -> a.getAllocationHoursPerMonth() != null ? a.getAllocationHoursPerMonth() : 0)
                .sum();
        int billableAllocated = activeAssignments.stream()
                .filter(a -> Boolean.TRUE.equals(a.getBillable()))
                .mapToInt(a -> a.getAllocationHoursPerMonth() != null ? a.getAllocationHoursPerMonth() : 0)
                .sum();
        int internalAllocated = activeAssignments.stream()
                .filter(a -> !Boolean.TRUE.equals(a.getBillable()))
                .mapToInt(a -> a.getAllocationHoursPerMonth() != null ? a.getAllocationHoursPerMonth() : 0)
                .sum();

        Integer availabilityPercent = (employee.getMonthlyCapacityHours() != null && employee.getMonthlyCapacityHours() > 0)
                ? Math.min((totalAllocated * 100) / employee.getMonthlyCapacityHours(), 100)
                : 0;
        Integer billablePercent = totalAllocated > 0
                ? (billableAllocated * 100) / totalAllocated
                : 0;
        Integer internalPercent = totalAllocated > 0
                ? (internalAllocated * 100) / totalAllocated
                : 0;

        List<ProjectSummaryDto> projects = activeAssignments.stream()
                .map(a -> {
                    int allocPercent = (employee.getMonthlyCapacityHours() != null && employee.getMonthlyCapacityHours() > 0)
                            ? (a.getAllocationHoursPerMonth() != null ? (a.getAllocationHoursPerMonth() * 100) / employee.getMonthlyCapacityHours() : 0)
                            : 0;
                    List<SkillDto> projectSkills = a.getProject().getSkills().stream()
                            .map(s -> SkillDto.builder().id(s.getId()).name(s.getName()).build())
                            .toList();
                    return ProjectSummaryDto.builder()
                            .id(a.getProject().getId())
                            .title(a.getProject().getTitle())
                            .status(a.getProject().getStatus())
                            .skills(projectSkills)
                            .allocationPercent(allocPercent)
                            .allocationHoursPerMonth(a.getAllocationHoursPerMonth())
                            .billable(a.getBillable())
                            .build();
                })
                .toList();

        return EmployeeDto.builder()
                .id(employee.getId())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .jobTitle(employee.getJobTitle())
                .monthlyCapacityHours(employee.getMonthlyCapacityHours())
                .availabilityPercent(availabilityPercent)
                .allocatedHours(totalAllocated)
                .billablePercent(billablePercent)
                .billableAllocatedHours(billableAllocated)
                .internalPercent(internalPercent)
                .internalAllocatedHours(internalAllocated)
                .projects(projects)
                .skills(skills)
                .team(teamDto)
                .build();
    }
}
