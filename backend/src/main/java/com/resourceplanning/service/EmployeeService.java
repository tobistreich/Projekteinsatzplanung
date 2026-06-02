package com.resourceplanning.service;

import com.resourceplanning.dto.*;
import com.resourceplanning.entity.Assignment;
import com.resourceplanning.entity.Employee;
import com.resourceplanning.entity.Skill;
import com.resourceplanning.entity.Team;
import com.resourceplanning.mapper.EmployeeMapper;
import com.resourceplanning.mapper.SkillMapper;
import com.resourceplanning.repository.AssignmentRepository;
import com.resourceplanning.repository.EmployeeRepository;
import com.resourceplanning.repository.SkillRepository;
import com.resourceplanning.repository.TeamRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.time.LocalDate;
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

    @Inject
    EmployeeMapper employeeMapper;

    @Inject
    SkillMapper skillMapper;

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
        LocalDate today = LocalDate.now();

        List<Assignment> allAssignments = assignmentRepository.findByEmployeeId(employee.getId());

        List<Assignment> activeAndUpcomingAssignments = allAssignments.stream()
                .filter(a -> a.getEndDate() == null || !a.getEndDate().isBefore(today))
                .toList();

        int totalAllocated = activeAndUpcomingAssignments.stream()
                .mapToInt(a -> a.getAllocationHoursPerMonth() != null ? a.getAllocationHoursPerMonth() : 0)
                .sum();
        int billableAllocated = activeAndUpcomingAssignments.stream()
                .filter(a -> Boolean.TRUE.equals(a.getBillable()))
                .mapToInt(a -> a.getAllocationHoursPerMonth() != null ? a.getAllocationHoursPerMonth() : 0)
                .sum();
        int internalAllocated = activeAndUpcomingAssignments.stream()
                .filter(a -> !Boolean.TRUE.equals(a.getBillable()))
                .mapToInt(a -> a.getAllocationHoursPerMonth() != null ? a.getAllocationHoursPerMonth() : 0)
                .sum();

        int cap = employee.getMonthlyCapacityHours() != null ? employee.getMonthlyCapacityHours() : 0;

        List<ProjectSummaryDto> projects = activeAndUpcomingAssignments.stream()
                .map(a -> {
                    int allocPercent = cap > 0 && a.getAllocationHoursPerMonth() != null
                            ? (a.getAllocationHoursPerMonth() * 100) / cap : 0;
                    return ProjectSummaryDto.builder()
                            .id(a.getProject().getId())
                            .title(a.getProject().getTitle())
                            .status(a.getProject().getStatus())
                            .skills(skillMapper.toDtoList(a.getProject().getSkills()))
                            .allocationPercent(allocPercent)
                            .allocationHoursPerMonth(a.getAllocationHoursPerMonth())
                            .billable(a.getBillable())
                            .startDate(a.getStartDate())
                            .endDate(a.getEndDate())
                            .build();
                })
                .toList();

        // MapStruct mappt strukturelle Felder (id, name, team, skills)
        EmployeeDto dto = employeeMapper.toBaseDto(employee);

        // Business-Logik-Metriken werden vom Service gesetzt
        dto.setUtilizationPercent(cap > 0 ? Math.min((totalAllocated * 100) / cap, 100) : 0);
        dto.setAllocatedHours(totalAllocated);
        dto.setBillablePercent(totalAllocated > 0 ? (billableAllocated * 100) / totalAllocated : 0);
        dto.setBillableAllocatedHours(billableAllocated);
        dto.setInternalPercent(totalAllocated > 0 ? (internalAllocated * 100) / totalAllocated : 0);
        dto.setInternalAllocatedHours(internalAllocated);
        dto.setProjects(projects);

        return dto;
    }
}
