package com.resourceplanning.service;

import com.resourceplanning.dto.CreateSkillDto;
import com.resourceplanning.dto.SkillDto;
import com.resourceplanning.entity.Skill;
import com.resourceplanning.mapper.SkillMapper;
import com.resourceplanning.repository.SkillRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;

@ApplicationScoped
public class SkillService {

    @Inject
    SkillRepository skillRepository;

    @Inject
    SkillMapper skillMapper;

    @Transactional
    public List<SkillDto> getAll() {
        return skillMapper.toDtoList(skillRepository.listAll());
    }

    @Transactional
    public SkillDto create(CreateSkillDto dto) {
        Skill skill = Skill.builder()
                .name(dto.getName())
                .build();
        skillRepository.persist(skill);
        return skillMapper.toDto(skill);
    }

    @Transactional
    public void delete(Long id) {
        if (!skillRepository.deleteById(id)) {
            throw new NotFoundException("Skill not found: " + id);
        }
    }
}
