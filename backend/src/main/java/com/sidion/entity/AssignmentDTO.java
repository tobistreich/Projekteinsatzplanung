package com.sidion.entity;

import java.time.LocalDate;

public class AssignmentDTO {
    public Long employeeId;
    public Long projectId;
    public LocalDate startDate;
    public LocalDate endDate;
    public double allocation;
    public AssignmentType type;
}
