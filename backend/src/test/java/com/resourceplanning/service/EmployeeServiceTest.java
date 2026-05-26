package com.resourceplanning.service;

import com.resourceplanning.dto.CreateEmployeeDto;
import com.resourceplanning.dto.EmployeeDto;
import com.resourceplanning.entity.Assignment;
import com.resourceplanning.entity.Employee;
import com.resourceplanning.entity.Project;
import com.resourceplanning.entity.ProjectStatus;
import com.resourceplanning.repository.AssignmentRepository;
import com.resourceplanning.repository.EmployeeRepository;
import com.resourceplanning.repository.SkillRepository;
import com.resourceplanning.repository.TeamRepository;
import jakarta.ws.rs.NotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.nullable;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock EmployeeRepository employeeRepository;
    @Mock AssignmentRepository assignmentRepository;
    @Mock TeamRepository teamRepository;
    @Mock SkillRepository skillRepository;
    @InjectMocks EmployeeService employeeService;

    @Test
    void getById_notFound_throwsNotFoundException() {
        when(employeeRepository.findByIdOptional(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.getById(99L))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void create_persistsEmployee() {
        CreateEmployeeDto dto = CreateEmployeeDto.builder()
                .firstName("Anna").lastName("Schmidt").jobTitle("Developer").monthlyCapacityHours(160)
                .build();
        // ID is null after mock persist, so stub with nullable matcher
        when(assignmentRepository.findByEmployeeId(nullable(Long.class))).thenReturn(List.of());

        EmployeeDto result = employeeService.create(dto);

        verify(employeeRepository).persist(any(Employee.class));
        assertThat(result.getFirstName()).isEqualTo("Anna");
        assertThat(result.getLastName()).isEqualTo("Schmidt");
    }

    @Test
    void getById_withActiveAssignment_calculatesMetrics() {
        Employee emp = employee(160);
        Assignment a = assignment(emp, LocalDate.now().minusMonths(1), LocalDate.now().plusMonths(1), 80, true);
        when(employeeRepository.findByIdOptional(1L)).thenReturn(Optional.of(emp));
        when(assignmentRepository.findByEmployeeId(1L)).thenReturn(List.of(a));

        EmployeeDto dto = employeeService.getById(1L);

        assertThat(dto.getAllocatedHours()).isEqualTo(80);
        assertThat(dto.getBillablePercent()).isEqualTo(100);
        assertThat(dto.getAvailabilityPercent()).isEqualTo(50); // 80/160
    }

    @Test
    void getById_withFutureAssignment_isIncludedInMetrics() {
        Employee emp = employee(160);
        Assignment a = assignment(emp, LocalDate.now().plusMonths(2), LocalDate.now().plusMonths(6), 100, true);
        when(employeeRepository.findByIdOptional(1L)).thenReturn(Optional.of(emp));
        when(assignmentRepository.findByEmployeeId(1L)).thenReturn(List.of(a));

        EmployeeDto dto = employeeService.getById(1L);

        // Regression: future assignments must be counted (not filtered to current month only)
        assertThat(dto.getAllocatedHours()).isEqualTo(100);
    }

    private Employee employee(int capacityHours) {
        return Employee.builder()
                .id(1L).firstName("Max").lastName("M")
                .monthlyCapacityHours(capacityHours).skills(new ArrayList<>())
                .build();
    }

    private Assignment assignment(Employee emp, LocalDate start, LocalDate end, int hours, boolean billable) {
        return Assignment.builder()
                .id(1L).employee(emp)
                .project(Project.builder().id(1L).title("P").status(ProjectStatus.ACTIVE)
                        .skills(new ArrayList<>()).build())
                .startDate(start).endDate(end)
                .allocationHoursPerMonth(hours).billable(billable)
                .build();
    }
}
