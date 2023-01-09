USE employee_db;
INSERT INTO department (name) 
    VALUES 
    ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");
INSERT INTO role (title, salary, department_id) 
    VALUES 
    ("Sales Lead", 120000, 1),
    ("Salesperson", 100000,1),
    ("Lead Engineer", 180000,2),
    ("Software Engineer", 140000,2),
    ("Account Manager", 160000,3),
    ("Accountant", 130000,3),
    ("Legal Team Lead", 120000,4),
    ("Lawyer", 110000,4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
    VALUES 
    ("Professor", "Oak", 1, null),
    ("Ash", "Ketchum", 2, 1),
    ("Shoto", "Todoroki", 3, null),
    ("Izuku", "Midoriya", 4, 3),
    ("Sasuke", "Uchiha", 5, null),
    ("Naruto", "Uzumaki", 6, 5),
    ("Killua", "Zoldyck", 7, null),
    ("Gon", "Freecss", 8, 7);