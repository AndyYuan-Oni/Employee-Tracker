USE tracker_DB;

INSERT INTO department (name)
VALUE ("Sales");
INSERT INTO department (name)
VALUE ("Finance");
INSERT INTO department (name)
VALUE ("Engineering");
INSERT INTO department (name)
VALUE ("Legal");

INSERT INTO role (title, salary, department_id)
VALUE ("Sales leader", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Salesperson", 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Lead Engineer", 150000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Software Engineer", 120000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Accountant", 125000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Legal Team Lead", 250000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Lawyer", 190000, 4);



INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Johnny", "Joe", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Lanny", "Loe", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ganny", "Goe", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Benny", "Boe", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Denny", "Doe", 6, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mandy", "Moe", 7, 6);