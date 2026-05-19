package com.resourceplanning.repository;

import com.resourceplanning.entity.Team;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class TeamRepository implements PanacheRepository<Team> {
}
