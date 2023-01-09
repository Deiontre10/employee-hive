const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const mysql = require('mysql2');

const db = mysql.createConnection({
    user: "root",
    database: "employee_db",
});

db.query('SELECT * FROM employee', (err, employees) => {
    console.table(employees);
});
db.query('SELECT * FROM department', (err, departments) => {
    console.table(departments);
});
db.query('SELECT * FROM role', (err, roles) => {
    console.table(roles);
});