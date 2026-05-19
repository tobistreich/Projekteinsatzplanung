package com.resourceplanning.repository;

import com.resourceplanning.entity.Assignment;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class AssignmentRepository implements PanacheRepository<Assignment> {

    public List<Assignment> findByEmployeeId(Long employeeId) {
        return find("employee.id", employeeId).list();
    }

    public List<Assignment> findByProjectId(Long projectId) {
        return find("project.id", projectId).list();
    }
}
