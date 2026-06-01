package com.resourceplanning.mapper;

import com.resourceplanning.dto.TeamDto;
import com.resourceplanning.dto.TeamSummaryDto;
import com.resourceplanning.entity.Team;
import org.mapstruct.Mapper;

@Mapper(componentModel = "jakarta-cdi")
public interface TeamMapper {
    TeamDto toDto(Team team);
    TeamSummaryDto toSummaryDto(Team team);
}
