// index.js
const inquirer = require('inquirer');
const db = require('./db');

const mainMenu = async () => {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Exit'
            ],
        },
    ]);

    switch (action) {
        case 'View All Departments':
            return viewDepartments();
        case 'View All Roles':
            return viewRoles();
        case 'View All Employees':
            return viewEmployees();
        case 'Add Department':
            return addDepartment();
        case 'Add Role':
            return addRole();
        case 'Add Employee':
            return addEmployee();
        case 'Update Employee Role':
            return updateEmployeeRole();
        default:
            process.exit();
    }
};

const viewDepartments = async () => {
    const res = await db.query('SELECT * FROM department');
    console.table(res.rows);
    mainMenu();
};

const viewRoles = async () => {
    const res = await db.query('SELECT * FROM role');
    console.table(res.rows);
    mainMenu();
};

const viewEmployees = async () => {
    const res = await db.query(`
        SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, 
        CASE WHEN e.manager_id IS NULL THEN 'None' ELSE CONCAT(m.first_name, ' ', m.last_name) END AS manager
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
    `);
    console.table(res.rows);
    mainMenu();
};

const addDepartment = async () => {
    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:',
        },
    ]);
    await db.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Added ${name} to the database.`);
    mainMenu();
};

const addRole = async () => {
    const departments = await db.query('SELECT * FROM department');
    const { title, salary, department_id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the role:',
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department for the role:',
            choices: departments.rows.map(dept => ({ name: dept.name, value: dept.id })),
        },
    ]);
    await db.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log(`Added ${title} to the database.`);
    mainMenu();
};

const addEmployee = async () => {
    const roles = await db.query('SELECT * FROM role');
    const employees = await db.query('SELECT * FROM employee');
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the first name of the employee:',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the last name of the employee:',
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the role for the employee:',
            choices: roles.rows.map(role => ({ name: role.title, value: role.id })),
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select the manager for the employee:',
            choices: [{ name: 'None', value: null }].concat(employees.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))),
        },
    ]);
    await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
    console.log(`Added ${first_name} ${last_name} to the database.`);
    mainMenu();
};

const updateEmployeeRole = async () => {
    const employees = await db.query('SELECT * FROM employee');
    const roles = await db.query('SELECT * FROM role');
    const { employee_id, role_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to update:',
            choices: employees.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })),
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the new role for the employee:',
            choices: roles.rows.map(role => ({ name: role.title, value: role.id })),
        },
    ]);
    await db.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log(`Updated employee's role.`);
    mainMenu();
};

mainMenu();
