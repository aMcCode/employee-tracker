INSERT into department (name)
VALUES
    ('Human Resources'),
    ('Programming'),
    ('System Validation');

INSERT into role (title, salary, department_id)
VALUES
    ('HR Director', 127000.5, 1),
    ('HR Manager', 105000.2, 1),
    ('HR Assistant', 75300.2, 1),
    ('Programming Director', 140000.5, 2),
    ('Programming Manager', 124275.2, 2),
    ('Programmer', 99999.2, 2),
    ('Validation Director', 85000.5, 3),
    ('Validation Manager', 100000.7, 3),
    ('Tester', 75000.2, 3);

INSERT into employee (first_name, last_name, role_id, manager_id)
VALUES
    ('HR', 'Director', 1, NULL),
    ('HR', 'Manager', 2, 1),
    ('HR', 'Assistant', 3, 2),
    ('Programming', 'Director', 4, NULL),
    ('Programming', 'Manager', 5, 4),
    ('Programming', 'Programmer', 6, 5),
    ('Validation', 'Director', 7, NULL),
    ('Validation', 'Manager', 8, 7),
    ('Validation', 'Tester', 9, 8);


