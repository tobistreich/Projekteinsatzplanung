package com.resourceplanning.service;

import com.resourceplanning.dto.CreateProjectDto;
import com.resourceplanning.dto.ProjectDto;
import com.resourceplanning.dto.SkillDto;
import com.resourceplanning.dto.UpdateProjectDto;
import com.resourceplanning.entity.Project;
import com.resourceplanning.repository.ProjectRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;

@ApplicationScoped
public class ProjectService {

    @Inject
    ProjectRepository projectRepository;

    @Transactional
    public List<ProjectDto> getAll() {
        return projectRepository.listAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public ProjectDto getById(Long id) {
        return projectRepository.findByIdOptional(id)
                .map(this::toDto)
                .orElseThrow(() -> new NotFoundException("Project not found: " + id));
    }

    @Transactional
    public ProjectDto create(CreateProjectDto dto) {
        Project project = Project.builder()
                .title(dto.getTitle())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status(dto.getStatus())
                .build();
        projectRepository.persist(project);
        return toDto(project);
    }

    @Transactional
    public ProjectDto update(Long id, UpdateProjectDto dto) {
        Project project = projectRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Project not found: " + id));
        if (dto.getTitle() != null) project.setTitle(dto.getTitle());
        if (dto.getStartDate() != null) project.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) project.setEndDate(dto.getEndDate());
        if (dto.getStatus() != null) project.setStatus(dto.getStatus());
        return toDto(project);
    }

    @Transactional
    public void delete(Long id) {
        if (!projectRepository.deleteById(id)) {
            throw new NotFoundException("Project not found: " + id);
        }
    }

    private ProjectDto toDto(Project project) {
        List<SkillDto> skills = project.getSkills().stream()
                .map(s -> SkillDto.builder().id(s.getId()).name(s.getName()).build())
                .toList();
        return ProjectDto.builder()
                .id(project.getId())
                .title(project.getTitle())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .status(project.getStatus())
                .skills(skills)
                .build();
    }
}
