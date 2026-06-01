CREATE TABLE skill (
    id   BIGINT       NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_skill_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE team (
    id   BIGINT       NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE employee (
    id                     BIGINT       NOT NULL AUTO_INCREMENT,
    first_name             VARCHAR(255) NULL,
    last_name              VARCHAR(255) NULL,
    job_title              VARCHAR(255) NULL,
    monthly_capacity_hours INT          NOT NULL DEFAULT 160,
    team_id                BIGINT       NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_employee_team FOREIGN KEY (team_id) REFERENCES team (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE project (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    title      VARCHAR(255) NULL,
    start_date DATE         NULL,
    end_date   DATE         NULL,
    status     ENUM('PLANNED','ACTIVE','DONE') NOT NULL DEFAULT 'PLANNED',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE assignment (
    id                        BIGINT      NOT NULL AUTO_INCREMENT,
    employee_id               BIGINT      NOT NULL,
    project_id                BIGINT      NOT NULL,
    start_date                DATE        NULL,
    end_date                  DATE        NULL,
    allocation_hours_per_month INT        NOT NULL DEFAULT 0,
    billable                  TINYINT(1)  NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uq_assignment_emp_proj (employee_id, project_id),
    CONSTRAINT fk_asgn_employee FOREIGN KEY (employee_id) REFERENCES employee (id) ON DELETE CASCADE,
    CONSTRAINT fk_asgn_project  FOREIGN KEY (project_id)  REFERENCES project  (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE employee_skill (
    employee_id BIGINT NOT NULL,
    skill_id    BIGINT NOT NULL,
    PRIMARY KEY (employee_id, skill_id),
    CONSTRAINT fk_es_employee FOREIGN KEY (employee_id) REFERENCES employee (id) ON DELETE CASCADE,
    CONSTRAINT fk_es_skill    FOREIGN KEY (skill_id)    REFERENCES skill    (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE project_skill (
    project_id BIGINT NOT NULL,
    skill_id   BIGINT NOT NULL,
    PRIMARY KEY (project_id, skill_id),
    CONSTRAINT fk_ps_project FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE,
    CONSTRAINT fk_ps_skill   FOREIGN KEY (skill_id)   REFERENCES skill   (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
