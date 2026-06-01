package com.resourceplanning.mapper;

import com.resourceplanning.dto.SkillDto;
import com.resourceplanning.entity.Skill;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "jakarta-cdi")
public interface SkillMapper {
    SkillDto toDto(Skill skill);
    List<SkillDto> toDtoList(List<Skill> skills);
}
