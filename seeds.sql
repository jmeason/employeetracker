INSERT INTO department (name) VALUES ('Sales'), ('Engineering'), ('Finance');

INSERT INTO role (title, salary, department_id) VALUES
('Sales Manager', 60000, 1),
('Salesperson', 40000, 1),
('Software Engineer', 80000, 2),
('Accountant', 70000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Harry', 'Potter', 1, NULL),
('JRon', 'Weasley', 2, 1),
('Hermione', 'Granger', 3, NULL),
('Draco', 'Malfoy', 4, NULL);
