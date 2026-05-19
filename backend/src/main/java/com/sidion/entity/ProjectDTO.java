package com.sidion.entity;

import java.time.LocalDate;
import java.util.List;

public class ProjectDTO {
    public String title;
    public LocalDate startDate;
    public LocalDate endDate;
    public double plannedDays;
    public String status;
    public List<Long> skillIds;
}
