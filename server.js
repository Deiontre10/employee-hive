const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const mysql = require('mysql2');
require('console.table');

const db = mysql.createConnection({
    user: "root",
    database: "employee_db",
});

const chooseAll = async (table, show) => {
    const results = await db.promise().query('SELECT * FROM ' + table);
    if (show) {
        console.table(results[0]);
        return init();
    };
    return results;
};

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
        case 'View All Employees': {
            chooseAll('employee', true);
            break;
        }
        case 'View All Departments': {
            chooseAll('department', true);
            break;
        }
        case 'View All Roles': {
            chooseAll('role', true);
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