package com.resourceplanning.repository;

import com.resourceplanning.entity.Skill;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SkillRepository implements PanacheRepository<Skill> {
}
