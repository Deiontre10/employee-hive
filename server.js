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

const selectNames = (table, name, value) => {
    return db.promise().query('SELECT ?? AS name, ?? AS value FROM ??', [name, value, table]);
};

const insertEmployee = async () => {
    const [managers] = await selectNames('employee', 'last_name', 'id');
    const [roles] = await selectNames('role', 'title', 'id');
    prompt([
        {
            name: 'first_name',
            message: 'Enter the first name.',
        },
        {
            name: 'last_name',
            message: 'Enter the last name.',
        },
        {
            type: 'rawlist',
            name: 'role_id',
            message: 'Choose a role.',
            choices: roles,
        },
        {
            type: 'rawlist',
            name: 'manager_id',
            message: 'Choose a manager.',
            choices: managers,
        },
    ])
    .then((answers) => {
        insert('employee', answers);
    });
};

const choices = (selection) => {
    switch (selection) {
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
            insertEmployee();
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
            'Add Employee',
            'View All Departments',
            'Add Department',
            'View All Roles',
            'Add Role',
            'Quit'
        ],
        name: 'selection',
    })
    .then((answers) => {
        choices(answers.selection);
    });
};

init();