package com.resourceplanning.service;

import com.resourceplanning.dto.*;
import com.resourceplanning.entity.Employee;
import com.resourceplanning.entity.Team;
import com.resourceplanning.repository.EmployeeRepository;
import com.resourceplanning.repository.TeamRepository;
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
        return EmployeeDto.builder()
                .id(employee.getId())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .jobTitle(employee.getJobTitle())
                .monthlyCapacityHours(employee.getMonthlyCapacityHours())
                .availabilityPercent(null)
                .skills(skills)
                .team(teamDto)
                .build();
    }
}
