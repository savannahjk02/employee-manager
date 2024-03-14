-- Insert departments
INSERT INTO departments (id, name) VALUES
  (1, 'Sales'),
  (2, 'Engineering'),
  (3, 'Finance'),
  (4, 'Marketing');

  -- Show departments
SELECT * FROM departments;

-- Insert roles
INSERT INTO roles (id, title, salary, departments_id) VALUES
  (1, 'Sales Manager', 70000.00, 1),
  (2, 'Sales Representative', 50000.00, 1),
  (3, 'Software Engineer', 90000.00, 2),
  (4, 'Frontend Developer', 80000.00, 2),
  (5, 'Financial Analyst', 75000.00, 3),
  (6, 'Marketing Coordinator', 60000.00, 4);

  -- Show roles
SELECT * FROM roles;

-- Insert employees
INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL), -- This is a manager
  ('Jane', 'Smith', 2, 1),   -- Managed by John
  ('Bob', 'Johnson', 3, 1),  -- Managed by John
  ('Alice', 'Williams', 4, 2),-- Managed by Jane
  ('Charlie', 'Brown', 5, 3), -- Managed by Bob
  ('Eva', 'Davis', 6, 4),     -- Managed by Alice
  ('Michael', 'Clark', 2, 1), -- Managed by John
  ('Sarah', 'Miller', 3, 1),  -- Managed by John
  ('David', 'Wilson', 4, 2),  -- Managed by Jane
  ('Olivia', 'Taylor', 5, 3), -- Managed by Bob
  ('Sophia', 'Anderson', 6, 4),-- Managed by Alice
  ('James', 'Martinez', 2, 1),-- Managed by John
  ('Emily', 'Hernandez', 3, 1),-- Managed by John
  ('Emma', 'Young', 4, 2),    -- Managed by Jane
  ('Ava', 'Lee', 5, 3),       -- Managed by Bob
  ('Logan', 'Walker', 6, 4),  -- Managed by Alice
  ('Mia', 'Perez', 2, 1),     -- Managed by John
  ('Lucas', 'Hall', 3, 1),    -- Managed by John
  ('Avery', 'Wright', 4, 2),  -- Managed by Jane
  ('Liam', 'Allen', 5, 3);    -- Managed by Bob


-- Show employees
SELECT * FROM employees;