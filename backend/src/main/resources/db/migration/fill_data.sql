-- Skills
INSERT INTO skill (id, name) VALUES
(1,  'Java'),
(2,  'SQL'),
(3,  'Docker'),
(4,  'Quarkus'),
(5,  'React'),
(6,  'Meddl'),
(7,  'Coffee'),
(8,  'Python'),
(9,  'DevOps'),
(10, 'Bootstrap');

-- Teams (ohne team_lead_id)
INSERT INTO team (id, name) VALUES
(1,  'Backend'),
(2,  'Frontend'),
(3,  'DevOps'),
(4,  'TestTeam'),
(5,  'DCD'),
(6,  'IOM'),
(7,  'Direct Report Delivery'),
(8,  'CORE'),
(9,  'GF'),
(10, 'SMT'),
(11, 'Direct Report');

-- Employees (IDs neu durchnummeriert, alte IDs: 1→1, 3→2, 4→3, 6→4, 7→5, 8→6, 9→7, 10→8, 11→9, 12→10, 13→11, 14→12, 15→13, 16→14, 17→15)
INSERT INTO employee (id, first_name, last_name, job_title, monthly_capacity_hours, team_id) VALUES
(1,  'Tobi',     'Streich',  'Junior Entwickler',                                                        160, 5),
(2,  'Tatiana',  'Belik',    'Junior Softwareentwicklerin',                                              160, 5),
(3,  'Mats',     'Pichler',  'Auszubildender Fachinformatiker der Anwendungsentwicklung',                80,  2),
(4,  'Mark',     'Keller',   'Dualer Student Wirtschaftsinformatik',                                     160, 5),
(5,  'Islam',    'Dedaev',   'Senior Systemadministrator',                                               160, 6),
(6,  'Michael',  'Voss',     'Senior Softwareentwickler | Guide',                                        160, 7),
(7,  'Christina','Kellidou', 'Referentin Controlling',                                                   160, 8),
(8,  'René',     'Sutorius', 'Geschäftsführer',                                                          160, 9),
(9,  'Nicolai',  'Ding',     'Geschäftsführer',                                                          160, 9),
(10, 'Matthias', 'Koch',     'Expert Softwareentwickler | Guide',                                        160, 7),
(11, 'Tamino',   'Schinke',  'Auszubildender Fachinformatiker der Anwendungsentwickung',                 160, 10),
(12, 'William',  'Kilburg',  'Softwareentwickler',                                                       160, 5),
(13, 'Stefan',   'Zeeb',     'Teamleiter Controlling und Rechnungswesen',                                160, 11),
(14, 'Julia',    'Gaab',     'Assistenz Controlling',                                                    80,  8),
(15, 'Nicole',   'Ebert',    'Senior Projektleiterin | Guide | Delivery Lead People Flow',               160, 7);

-- Projects (IDs neu durchnummeriert, alte IDs: 2→1, 3→2, 4→3, 5→4, 6→5, 7→6, 8→7)
INSERT INTO project (id, title, start_date, end_date, status) VALUES
(1, 'Projekteinsatzplanung', '2026-05-18', '2026-06-09', 'ACTIVE'),
(2, 'OASE',                  '2026-06-01', '2026-12-31', 'PLANNED'),
(3, 'Binder Bsort CO&KG',    '2025-12-08', '2026-06-30', 'ACTIVE'),
(4, 'MBB',                   '2021-06-01', '2027-09-15', 'ACTIVE'),
(5, 'IT-Support',            '2014-01-01', '2026-05-26', 'ACTIVE'),
(6, 'KI Rag Bachelorarbeit', '2026-03-01', '2026-05-27', 'ACTIVE'),
(7, 'DGNB',                  '2024-11-01', NULL,         'ACTIVE');

-- Assignments (IDs 1–9, employee_id und project_id gemappt)
INSERT INTO assignment (id, employee_id, project_id, start_date, end_date, allocation_hours_per_month, billable) VALUES
(1, 1,  1, '2026-03-01', '2026-09-30', 84,  0),
(2, 5,  4, '2024-02-05', '2027-09-16', 120, 1),
(3, 5,  5, '2016-01-01', '2026-05-26', 30,  0),
(4, 3,  2, '2026-05-26', '2026-12-31', 80,  1),
(5, 2,  3, '2025-12-01', '2026-06-30', 100, 1),
(6, 4,  6, '2026-02-01', '2026-05-31', 160, 0),
(7, 10, 1, '2026-05-18', '2026-06-09', 10,  0),
(8, 1,  3, '2026-06-10', '2026-07-31', 76,  1),
(9, 12, 3, '2026-04-13', NULL,         160, 1);

-- Employee Skills (employee_id gemappt)
INSERT INTO employee_skill (employee_id, skill_id) VALUES
-- Java (1)
(1,  1), (2,  1), (4,  1), (10, 1), (11, 1), (12, 1),
-- SQL (2)
(3,  2), (4,  2), (10, 2),
-- Docker (3)
(1,  3), (2,  3), (10, 3),
-- Quarkus (4)
(1,  4),
-- React (5)
(1,  5), (2,  5), (12, 5),
-- Python (8)
(1,  8), (4,  8),
-- DevOps (9)
(5,  9);

-- Project Skills (project_id gemappt)
INSERT INTO project_skill (project_id, skill_id) VALUES
-- Java (1)
(1, 1), (6, 1), (7, 1),
-- SQL (2)
(1, 2), (2, 2),
-- Docker (3)
(2, 3),
-- React (5)
(1, 5), (3, 5),
-- DevOps (9)
(4, 9), (5, 9),
-- Bootstrap (10)
(6, 10);
