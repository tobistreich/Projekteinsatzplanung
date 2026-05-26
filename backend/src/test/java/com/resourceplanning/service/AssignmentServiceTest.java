package com.resourceplanning.service;

import com.resourceplanning.dto.CreateAssignmentDto;
import com.resourceplanning.entity.Assignment;
import com.resourceplanning.entity.Employee;
import com.resourceplanning.entity.Project;
import com.resourceplanning.entity.ProjectStatus;
import com.resourceplanning.repository.AssignmentRepository;
import com.resourceplanning.repository.EmployeeRepository;
import com.resourceplanning.repository.ProjectRepository;
import jakarta.ws.rs.BadRequestException;
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

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AssignmentServiceTest {

    @Mock AssignmentRepository assignmentRepository;
    @Mock EmployeeRepository employeeRepository;
    @Mock ProjectRepository projectRepository;
    @InjectMocks AssignmentService assignmentService;

    @Test
    void create_exceedsCapacity_throwsBadRequestException() {
        Employee emp = employee(160);
        Project proj = project();
        LocalDate start = LocalDate.of(2026, 6, 1);
        LocalDate end = LocalDate.of(2026, 6, 30);

        // existing assignment already occupies 100h in June
        Assignment existing = Assignment.builder()
                .id(1L).employee(emp).project(proj)
                .startDate(start).endDate(end)
                .allocationHoursPerMonth(100).billable(false).build();

        CreateAssignmentDto dto = CreateAssignmentDto.builder()
                .employeeId(1L).projectId(2L)
                .startDate(start).endDate(end)
                .allocationHoursPerMonth(80).billable(true).build();

        when(employeeRepository.findByIdOptional(1L)).thenReturn(Optional.of(emp));
        when(projectRepository.findByIdOptional(2L)).thenReturn(Optional.of(proj));
        when(assignmentRepository.findByEmployeeId(1L)).thenReturn(List.of(existing));

        // 100 + 80 = 180h > 160h capacity
        assertThatThrownBy(() -> assignmentService.create(dto))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void create_withinCapacity_persistsAssignment() {
        Employee emp = employee(160);
        Project proj = project();
        LocalDate start = LocalDate.of(2026, 6, 1);
        LocalDate end = LocalDate.of(2026, 6, 30);

        // existing assignment: 80h in June
        Assignment existing = Assignment.builder()
                .id(1L).employee(emp).project(proj)
                .startDate(start).endDate(end)
                .allocationHoursPerMonth(80).billable(false).build();

        CreateAssignmentDto dto = CreateAssignmentDto.builder()
                .employeeId(1L).projectId(2L)
                .startDate(start).endDate(end)
                .allocationHoursPerMonth(80).billable(true).build();

        when(employeeRepository.findByIdOptional(1L)).thenReturn(Optional.of(emp));
        when(projectRepository.findByIdOptional(2L)).thenReturn(Optional.of(proj));
        when(assignmentRepository.findByEmployeeId(1L)).thenReturn(List.of(existing));

        // 80 + 80 = 160h = exact capacity → OK
        assertThatCode(() -> assignmentService.create(dto)).doesNotThrowAnyException();
        verify(assignmentRepository).persist(any(Assignment.class));
    }

    @Test
    void delete_notFound_throwsNotFoundException() {
        when(assignmentRepository.deleteById(99L)).thenReturn(false);

        assertThatThrownBy(() -> assignmentService.delete(99L))
                .isInstanceOf(NotFoundException.class);
    }

    private Employee employee(int capacity) {
        return Employee.builder()
                .id(1L).firstName("Max").lastName("M")
                .monthlyCapacityHours(capacity).skills(new ArrayList<>())
                .build();
    }

    private Project project() {
        return Project.builder()
                .id(2L).title("P").status(ProjectStatus.ACTIVE).skills(new ArrayList<>())
                .build();
    }
}
