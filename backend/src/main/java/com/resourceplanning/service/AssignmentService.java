package com.resourceplanning.service;

import com.resourceplanning.dto.AssignmentDto;
import com.resourceplanning.dto.CreateAssignmentDto;
import com.resourceplanning.dto.EmployeeSummaryDto;
import com.resourceplanning.dto.ProjectSummaryDto;
import com.resourceplanning.dto.SkillDto;
import com.resourceplanning.entity.Assignment;
import com.resourceplanning.entity.Employee;
import com.resourceplanning.entity.Project;
import com.resourceplanning.repository.AssignmentRepository;
import com.resourceplanning.repository.EmployeeRepository;
import com.resourceplanning.repository.ProjectRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;

import java.time.YearMonth;
import java.util.List;

@ApplicationScoped
public class AssignmentService {

    @Inject
    AssignmentRepository assignmentRepository;

    @Inject
    EmployeeRepository employeeRepository;

    @Inject
    ProjectRepository projectRepository;

    @Transactional
    public List<AssignmentDto> getAll() {
        return assignmentRepository.listAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public AssignmentDto getById(Long id) {
        return assignmentRepository.findByIdOptional(id)
                .map(this::toDto)
                .orElseThrow(() -> new NotFoundException("Assignment not found: " + id));
    }

    @Transactional
    public List<AssignmentDto> getByEmployee(Long employeeId) {
        return assignmentRepository.findByEmployeeId(employeeId).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public List<AssignmentDto> getByProject(Long projectId) {
        return assignmentRepository.findByProjectId(projectId).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public AssignmentDto create(CreateAssignmentDto dto) {
        Employee employee = employeeRepository.findByIdOptional(dto.getEmployeeId())
                .orElseThrow(() -> new NotFoundException("Employee not found: " + dto.getEmployeeId()));
        Project project = projectRepository.findByIdOptional(dto.getProjectId())
                .orElseThrow(() -> new NotFoundException("Project not found: " + dto.getProjectId()));
        validateCapacity(employee, dto);
        Assignment assignment = Assignment.builder()
                .employee(employee)
                .project(project)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .allocationHoursPerMonth(dto.getAllocationHoursPerMonth())
                .billable(dto.getBillable())
                .build();
        assignmentRepository.persist(assignment);
        return toDto(assignment);
    }

    @Transactional
    public void delete(Long id) {
        if (!assignmentRepository.deleteById(id)) {
            throw new NotFoundException("Assignment not found: " + id);
        }
    }

    private void validateCapacity(Employee employee, CreateAssignmentDto dto) {
        if (employee.getMonthlyCapacityHours() == null || dto.getAllocationHoursPerMonth() == null) return;

        List<Assignment> existing = assignmentRepository.findByEmployeeId(employee.getId());

        YearMonth start = YearMonth.from(dto.getStartDate());
        YearMonth end = dto.getEndDate() != null ? YearMonth.from(dto.getEndDate()) : YearMonth.now().plusYears(10);

        for (YearMonth month = start; !month.isAfter(end); month = month.plusMonths(1)) {
            final YearMonth m = month;
            int total = dto.getAllocationHoursPerMonth() + existing.stream()
                    .filter(a -> a.getAllocationHoursPerMonth() != null)
                    .filter(a -> !YearMonth.from(a.getStartDate()).isAfter(m)
                              && !YearMonth.from(a.getEndDate()).isBefore(m))
                    .mapToInt(Assignment::getAllocationHoursPerMonth)
                    .sum();

            if (total > employee.getMonthlyCapacityHours()) {
                throw new BadRequestException(
                        "Kapazität überschritten für " + m + ": " + total + "h von max. "
                        + employee.getMonthlyCapacityHours() + "h"
                );
            }
        }
    }

    private AssignmentDto toDto(Assignment assignment) {
        Employee e = assignment.getEmployee();
        Project p = assignment.getProject();
        return AssignmentDto.builder()
                .id(assignment.getId())
                .employee(EmployeeSummaryDto.builder()
                        .id(e.getId())
                        .firstName(e.getFirstName())
                        .lastName(e.getLastName())
                        .jobTitle(e.getJobTitle())
                        .skills(e.getSkills() == null ? List.of() :
                                e.getSkills().stream()
                                        .map(s -> SkillDto.builder().id(s.getId()).name(s.getName()).build())
                                        .toList())
                        .build())
                .project(ProjectSummaryDto.builder()
                        .id(p.getId())
                        .title(p.getTitle())
                        .status(p.getStatus())
                        .build())
                .startDate(assignment.getStartDate())
                .endDate(assignment.getEndDate())
                .allocationHoursPerMonth(assignment.getAllocationHoursPerMonth())
                .billable(assignment.getBillable())
                .build();
    }
}
