package com.resourceplanning.service;

import com.resourceplanning.dto.EmployeeMatchDto;
import com.resourceplanning.entity.Assignment;
import com.resourceplanning.entity.Employee;
import com.resourceplanning.entity.Project;
import com.resourceplanning.entity.ProjectStatus;
import com.resourceplanning.entity.Skill;
import com.resourceplanning.repository.AssignmentRepository;
import com.resourceplanning.repository.EmployeeRepository;
import com.resourceplanning.repository.ProjectRepository;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MatchingServiceTest {

    @Mock ProjectRepository projectRepository;
    @Mock EmployeeRepository employeeRepository;
    @Mock AssignmentRepository assignmentRepository;
    @InjectMocks MatchingService matchingService;

    @Test
    void findMatchingEmployees_projectWithNoSkills_returnsEmpty() {
        Project proj = Project.builder()
                .id(1L).title("P").status(ProjectStatus.ACTIVE)
                .skills(new ArrayList<>())
                .startDate(LocalDate.of(2026, 7, 1)).endDate(LocalDate.of(2026, 9, 30))
                .build();
        when(projectRepository.findByIdOptional(1L)).thenReturn(Optional.of(proj));

        List<EmployeeMatchDto> result = matchingService.findMatchingEmployees(1L);

        assertThat(result).isEmpty();
    }

    @Test
    void findMatchingEmployees_excludesFullyBookedEmployee() {
        Skill java = skill(1L, "Java");
        Project proj = project(List.of(java));
        Employee emp = employee(1L, 160, List.of(java));

        when(projectRepository.findByIdOptional(1L)).thenReturn(Optional.of(proj));
        when(employeeRepository.findByAnySkillIn(any())).thenReturn(List.of(emp));
        // Employee fully booked during the project period
        when(assignmentRepository.findByEmployeeId(1L)).thenReturn(List.of(
                Assignment.builder().id(10L).employee(emp).project(proj)
                        .startDate(proj.getStartDate()).endDate(proj.getEndDate())
                        .allocationHoursPerMonth(160).billable(true).build()
        ));

        List<EmployeeMatchDto> result = matchingService.findMatchingEmployees(1L);

        assertThat(result).isEmpty();
    }

    @Test
    void findMatchingEmployees_sortedByMatchedSkillCount() {
        Skill java = skill(1L, "Java");
        Skill kotlin = skill(2L, "Kotlin");
        Project proj = project(List.of(java, kotlin));
        Employee empOne = employee(1L, 160, List.of(java));          // 1 match
        Employee empTwo = employee(2L, 160, List.of(java, kotlin));  // 2 matches

        when(projectRepository.findByIdOptional(1L)).thenReturn(Optional.of(proj));
        when(employeeRepository.findByAnySkillIn(any())).thenReturn(List.of(empOne, empTwo));
        when(assignmentRepository.findByEmployeeId(any())).thenReturn(List.of());

        List<EmployeeMatchDto> result = matchingService.findMatchingEmployees(1L);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getMatchedSkillsCount()).isEqualTo(2);
        assertThat(result.get(1).getMatchedSkillsCount()).isEqualTo(1);
    }

    private Skill skill(Long id, String name) {
        return Skill.builder().id(id).name(name).build();
    }

    private Project project(List<Skill> skills) {
        return Project.builder()
                .id(1L).title("P").status(ProjectStatus.ACTIVE)
                .skills(new ArrayList<>(skills))
                .startDate(LocalDate.of(2026, 7, 1)).endDate(LocalDate.of(2026, 9, 30))
                .build();
    }

    private Employee employee(Long id, int capacity, List<Skill> skills) {
        return Employee.builder()
                .id(id).firstName("E" + id).lastName("L")
                .monthlyCapacityHours(capacity).skills(new ArrayList<>(skills))
                .build();
    }
}
