package com.resourceplanning.service;

import com.resourceplanning.dto.CreateProjectDto;
import com.resourceplanning.dto.ProjectDto;
import com.resourceplanning.dto.UpdateProjectDto;
import com.resourceplanning.entity.Project;
import com.resourceplanning.entity.Skill;
import com.resourceplanning.mapper.ProjectMapper;
import com.resourceplanning.repository.ProjectRepository;
import com.resourceplanning.repository.SkillRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;

@ApplicationScoped
public class ProjectService {

    @Inject
    ProjectRepository projectRepository;

    @Inject
    SkillRepository skillRepository;

    @Inject
    ProjectMapper projectMapper;

    @Transactional
    public List<ProjectDto> getAll() {
        return projectRepository.listAll().stream()
                .map(projectMapper::toDto)
                .toList();
    }

    @Transactional
    public ProjectDto getById(Long id) {
        return projectRepository.findByIdOptional(id)
                .map(projectMapper::toDto)
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
        return projectMapper.toDto(project);
    }

    @Transactional
    public ProjectDto update(Long id, UpdateProjectDto dto) {
        Project project = projectRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Project not found: " + id));
        if (dto.getTitle() != null) project.setTitle(dto.getTitle());
        if (dto.getStartDate() != null) project.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) project.setEndDate(dto.getEndDate());
        if (dto.getStatus() != null) project.setStatus(dto.getStatus());
        if (dto.getSkillIds() != null) {
            List<Skill> skills = dto.getSkillIds().stream()
                    .map(sid -> skillRepository.findByIdOptional(sid)
                            .orElseThrow(() -> new NotFoundException("Skill not found: " + sid)))
                    .toList();
            project.getSkills().clear();
            project.getSkills().addAll(skills);
        }
        return projectMapper.toDto(project);
    }

    @Transactional
    public void delete(Long id) {
        if (!projectRepository.deleteById(id)) {
            throw new NotFoundException("Project not found: " + id);
        }
    }
}
