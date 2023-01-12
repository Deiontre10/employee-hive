const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const mysql = require('mysql2');
require('console.table');

const db = mysql.createConnection({
    user: "root",
    database: "employee_db",
});

const insert = (table, data) => {
    db.query('INSERT INTO ?? SET ?', [table, data], (err) => {
        if (err) return console.error(err);
        console.log('\nCreated Employee\n');
        init();
    });
};

const choices = (something) => {
    switch (something) {
        case 'VIEW ALL EMPLOYEES': {
            db.query('SELECT * FROM employee', (err, employees) => {
                console.table(employees);
                init();
            });
            break;
        }
        case 'VIEW ALL DEPARTMENTS': {
            db.query('SELECT * FROM department', (err, departments) => {
                console.table(departments);
                init();
            });
            break;
        }
        case 'VIEW ALL ROLES': {
            db.query('SELECT * FROM role', (err, roles) => {
                console.table(roles);
                init();
            });
            break;
        }
        case 'Add Employee': {
            
            break;
        }
    };
};

const init = () => {
    prompt({
        type: 'rawlist',
        message: 'Choose one of the following',
        choices: [
            'View All Employees',
            'View All Departments',
            'View All Roles',
            'Add Employee'
        ],
        name: 'something',
    })
    .then((answers) => {
        choices(answers.something);
    });
};

init();