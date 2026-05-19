package com.resourceplanning.service;

import com.resourceplanning.dto.EmployeeMatchDto;
import com.resourceplanning.dto.SkillDto;
import com.resourceplanning.entity.Assignment;
import com.resourceplanning.entity.Employee;
import com.resourceplanning.entity.Project;
import com.resourceplanning.entity.Skill;
import com.resourceplanning.repository.AssignmentRepository;
import com.resourceplanning.repository.EmployeeRepository;
import com.resourceplanning.repository.ProjectRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@ApplicationScoped
public class MatchingService {

    @Inject
    ProjectRepository projectRepository;

    @Inject
    EmployeeRepository employeeRepository;

    @Inject
    AssignmentRepository assignmentRepository;

    @Transactional
    public List<EmployeeMatchDto> findMatchingEmployees(Long projectId) {
        Project project = projectRepository.findByIdOptional(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found: " + projectId));

        List<Skill> projectSkills = project.getSkills();
        if (projectSkills.isEmpty()) {
            return List.of();
        }

        Set<Long> projectSkillIds = projectSkills.stream()
                .map(Skill::getId)
                .collect(Collectors.toSet());

        YearMonth projectStart = project.getStartDate() != null ? YearMonth.from(project.getStartDate()) : null;
        YearMonth projectEnd = project.getEndDate() != null ? YearMonth.from(project.getEndDate()) : null;

        return employeeRepository.findByAnySkillIn(new java.util.ArrayList<>(projectSkillIds)).stream()
                .map(e -> toMatchDto(e, projectSkillIds, projectSkills.size(), projectStart, projectEnd))
                .filter(dto -> dto.getMinRemainingCapacityHours() > 0)
                .sorted(Comparator.comparingInt(EmployeeMatchDto::getMatchedSkillsCount).reversed())
                .toList();
    }

    private EmployeeMatchDto toMatchDto(Employee e, Set<Long> projectSkillIds, int totalProjectSkills,
                                        YearMonth projectStart, YearMonth projectEnd) {
        List<SkillDto> allSkills = e.getSkills().stream()
                .map(s -> SkillDto.builder().id(s.getId()).name(s.getName()).build())
                .toList();

        List<SkillDto> matchedSkills = e.getSkills().stream()
                .filter(s -> projectSkillIds.contains(s.getId()))
                .map(s -> SkillDto.builder().id(s.getId()).name(s.getName()).build())
                .toList();

        int minRemaining = computeMinRemainingCapacity(e, projectStart, projectEnd);

        return EmployeeMatchDto.builder()
                .id(e.getId())
                .firstName(e.getFirstName())
                .lastName(e.getLastName())
                .jobTitle(e.getJobTitle())
                .monthlyCapacityHours(e.getMonthlyCapacityHours())
                .skills(allSkills)
                .matchedSkills(matchedSkills)
                .matchedSkillsCount(matchedSkills.size())
                .totalProjectSkillsCount(totalProjectSkills)
                .minRemainingCapacityHours(minRemaining)
                .build();
    }

    private int computeMinRemainingCapacity(Employee e, YearMonth start, YearMonth end) {
        if (e.getMonthlyCapacityHours() == null) return 0;
        if (start == null || end == null) return e.getMonthlyCapacityHours();

        List<Assignment> assignments = assignmentRepository.findByEmployeeId(e.getId());
        int min = e.getMonthlyCapacityHours();

        for (YearMonth month = start; !month.isAfter(end); month = month.plusMonths(1)) {
            final YearMonth m = month;
            int allocated = assignments.stream()
                    .filter(a -> a.getAllocationHoursPerMonth() != null)
                    .filter(a -> !YearMonth.from(a.getStartDate()).isAfter(m)
                              && !YearMonth.from(a.getEndDate()).isBefore(m))
                    .mapToInt(Assignment::getAllocationHoursPerMonth)
                    .sum();
            min = Math.min(min, e.getMonthlyCapacityHours() - allocated);
        }
        return min;
    }
}
