package com.resourceplanning.repository;

import com.resourceplanning.entity.Employee;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class EmployeeRepository implements PanacheRepository<Employee> {

    public List<Employee> findByAnySkillIn(List<Long> skillIds) {
        return find("SELECT DISTINCT e FROM Employee e JOIN e.skills s WHERE s.id IN ?1", skillIds).list();
    }
}
