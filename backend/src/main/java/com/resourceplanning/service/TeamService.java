package com.resourceplanning.service;

import com.resourceplanning.dto.CreateTeamDto;
import com.resourceplanning.dto.EmployeeSummaryDto;
import com.resourceplanning.dto.TeamDto;
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
public class TeamService {

    @Inject
    TeamRepository teamRepository;

    @Inject
    EmployeeRepository employeeRepository;

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
        if (dto.getTeamLeadId() != null) {
            Employee lead = employeeRepository.findByIdOptional(dto.getTeamLeadId())
                    .orElseThrow(() -> new NotFoundException("Employee not found: " + dto.getTeamLeadId()));
            team.setTeamLead(lead);
        }
        teamRepository.persist(team);
        return toDto(team);
    }

    private TeamDto toDto(Team team) {
        EmployeeSummaryDto leadDto = null;
        if (team.getTeamLead() != null) {
            Employee lead = team.getTeamLead();
            leadDto = EmployeeSummaryDto.builder()
                    .id(lead.getId())
                    .firstName(lead.getFirstName())
                    .lastName(lead.getLastName())
                    .jobTitle(lead.getJobTitle())
                    .build();
        }
        return TeamDto.builder()
                .id(team.getId())
                .name(team.getName())
                .teamLead(leadDto)
                .build();
    }
}
