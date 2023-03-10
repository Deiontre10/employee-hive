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

const chooseEmployeeDetails = async () => {
    const details = `
SELECT
    employee.id,
    employee.first_name,
    employee.last_name,
    role.title,
    role.salary,
    CONCAT(
        manager.first_name,
        ' ',
        manager.last_name
    ) AS manager,
    department.name AS department
FROM employee
JOIN role
ON employee.role_id = role.id
JOIN employee AS manager
ON employee.manager_id = manager.id
JOIN department
ON role.department_id = department.id
    `
        const [employees] = await db.promise().query(details);
        console.table(employees);
        init();
};
const chooseEmployeeRole = async () => {
    const details = `
SELECT
    role.id, 
    role.title,
    role.salary,
    department.name AS department
FROM role
JOIN department
ON role.department_id = department.id
    `
        const [roles] = await db.promise().query(details);
        console.table(roles);
        init();
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

const updateRole = async () => {
    const [employees] = await selectNames('employee', 'last_name', 'id');
    const [roles] = await selectNames('role', 'title', 'id');
    prompt([
        {
            type: 'rawlist',
            name: 'id',
            message: 'Choose a employee.',
            choices: employees,
        },
        {
            type: 'rawlist',
            name: 'role_id',
            message: 'Choose a role.',
            choices: roles,
        },
    ])
    .then((answers) => {
        insert('employee', answers);
    });
};

const insertRole = async () => {
    const [departments] = await selectNames('department', 'name', 'id');
    prompt([
        {
            name: 'title',
            message: 'Enter the name of the role.',
        },
        {
            name: 'salary',
            message: 'Enter a salary for this role.',
        },
        {
            type: 'rawlist',
            name: 'department_id',
            message: 'Choose a department.',
            choices: departments,
        },
    ])
    .then((answers) => {
        insert('role', answers);
    });
};

const insertDepartment = async () => {
    prompt([
        {
            name: 'name',
            message: 'Enter the name of the department.',
        },
        
    ])
    .then((answers) => {
        insert('department', answers);
    });
};

const choices = (selection) => {
    switch (selection) {
        case 'View All Employees': {
            chooseEmployeeDetails();
            break;
        }
        case 'View All Departments': {
            chooseAll('department', true);
            break;
        }
        case 'View All Roles': {
            chooseEmployeeRole();
            break;
        }
        case 'Add Employee': {
            insertEmployee();
            break;
        }
        case 'Add Department': {
            insertDepartment();
            break;
        }
        case 'Add Role': {
            insertRole();
            break;
        }
        case 'Update Employee Role': {
            updateRole();
            break;
        }
        case 'Quit': {
            process.exit(0);
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
            'Update Employee Role',
            'Quit'
        ],
        name: 'selection',
    })
    .then((answers) => {
        choices(answers.selection);
    });
};

init();