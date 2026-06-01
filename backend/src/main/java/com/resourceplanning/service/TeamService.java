package com.resourceplanning.service;

import com.resourceplanning.dto.CreateTeamDto;
import com.resourceplanning.dto.TeamDto;
import com.resourceplanning.entity.Team;
import com.resourceplanning.repository.TeamRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class TeamService {

    @Inject
    TeamRepository teamRepository;

    @Transactional
    public List<TeamDto> getAll() {
        return teamRepository.listAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public TeamDto create(CreateTeamDto dto) {
        Team team = Team.builder()
                .name(dto.getName())
                .build();
        teamRepository.persist(team);
        return toDto(team);
    }

    private TeamDto toDto(Team team) {
        return TeamDto.builder()
                .id(team.getId())
                .name(team.getName())
                .build();
    }
}
