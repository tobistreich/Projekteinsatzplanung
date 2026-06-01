package com.resourceplanning.service;

import com.resourceplanning.dto.CreateTeamDto;
import com.resourceplanning.dto.TeamDto;
import com.resourceplanning.entity.Team;
import com.resourceplanning.mapper.TeamMapper;
import com.resourceplanning.repository.TeamRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class TeamService {

    @Inject
    TeamRepository teamRepository;

    @Inject
    TeamMapper teamMapper;

    @Transactional
    public List<TeamDto> getAll() {
        return teamRepository.listAll().stream()
                .map(teamMapper::toDto)
                .toList();
    }

    @Transactional
    public TeamDto create(CreateTeamDto dto) {
        Team team = Team.builder()
                .name(dto.getName())
                .build();
        teamRepository.persist(team);
        return teamMapper.toDto(team);
    }
}
