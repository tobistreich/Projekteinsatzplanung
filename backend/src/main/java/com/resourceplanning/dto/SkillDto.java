package com.resourceplanning.dto;

import com.resourceplanning.entity.Skill;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RegisterForReflection
public class SkillDto {
    private Long id;
    private String name;

    public static SkillDto from(Skill skill) {
        return SkillDto.builder().id(skill.getId()).name(skill.getName()).build();
    }
}
