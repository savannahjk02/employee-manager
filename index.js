// Import required libraries
const { table } = require('table');
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

// Create a database connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'company_db'
});

// Function to start the application and prompt user actions
const startApplication = async () => {
  // Define choices for user actions
  const choices = [
    'View all employees',
    'View all departments',
    'View all roles',
    'Add an employee',
    'Update employee role',
    'Update employee manager',
    'View employees by manager',
    'View employees by department',
    'Delete department',
    'Delete role',
    'Delete employee',
    'View department budget',
    'Add department', // Add 'Add department' choice
    'Add role', // Add 'Add role' choice
    'Exit'
  ];

  // Prompt user to choose an action
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: choices,
  });

  // Execute corresponding action based on user choice
  switch (action) {
    case 'View all employees':
      await viewAllEmployees();
      break;

    case 'View all departments':
      await viewAllDepartments();
      break;

    case 'View all roles':
      await viewAllRoles();
      break;

    case 'Add an employee':
      await addEmployee();
      break;

    case 'Update employee role':
      await updateEmployeeRole();
      break;

    case 'Update employee manager':
      await updateEmployeeManager();
      break;

    case 'View employees by manager':
      await viewEmployeesByManager();
      break;

    case 'View employees by department':
      await viewEmployeesByDepartment();
      break;

    case 'Delete department':
      await deleteDepartment();
      break;

    case 'Delete role':
      await deleteRole();
      break;

    case 'Delete employee':
      await deleteEmployee();
      break;

    case 'View department budget':
      await viewDepartmentBudget();
      break;

    case 'Add department':
      await addDepartment(); // Call the addDepartment function
      break;

    case 'Add role':
      await addRole(); // Call the addRole function
      break;

    case 'Exit':
      console.log('Exiting the application.');
      await db.end(); // Close database connection
      break;

    default:
      console.log('Invalid action. Please choose a valid option.');
      await startApplication(); // Restart application if invalid action is chosen
      break;
  }
};

// Function to add a new department
const addDepartment = async () => {
  // Prompt user to enter department name
  const departmentInfo = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Enter the name of the new department:',
  });

  // Insert new department into the departments table
  await db.query("INSERT INTO departments SET ?", departmentInfo);
  console.log('Department added successfully!');
  await startApplication(); // Restart the application
};

// Function to add a new role
const addRole = async () => {
  // Retrieve existing departments from the database
  const departments = await db.query("SELECT id, name FROM departments;");
  
  // Prompt user to enter role details
  const roleInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the new role:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary for the new role:',
    },
    {
      type: 'list',
      name: 'departments_id',
      message: 'Choose the department for the new role:',
      choices: departments[0].map(department => ({ name: department.name, value: department.id })),
    },
  ]);

  // Insert new role into the roles table
  await db.query("INSERT INTO roles SET ?", roleInfo);
  console.log('Role added successfully!');
  await startApplication(); // Restart the application
};

// Function to view all employees
const viewAllEmployees = async () => {
  // Retrieve all employees from the database
  const [results] = await db.query("SELECT * FROM employees;");
  const data = results.map(row => Object.values(row));
  data.unshift(["id", "first_name", "last_name", "roles_id", "manager_id"]);
  console.log(table(data)); // Display data in table format
  await startApplication(); // Restart the application
};

// Function to view all departments
const viewAllDepartments = async () => {
  // Retrieve all departments from the database
  const [departments] = await db.query("SELECT id, name FROM departments;");
  const data = departments.map(row => [row.id, row.name]);
  const titles = ['ID', 'Department Name'];
  console.log(table([titles, ...data])); // Display data in table format with titles
  await startApplication(); // Restart the application
};

// Function to view all roles
const viewAllRoles = async () => {
  // Retrieve all roles from the database
  const [roles] = await db.query("SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles JOIN departments ON roles.departments_id = departments.id;");
  const data = roles.map(row => [row.id, row.title, row.department, row.salary]);
  const titles = ['ID', 'Title', 'Department', 'Salary'];
  console.log(table([titles, ...data])); // Display data in table format with titles
  await startApplication(); // Restart the application
};

// Function to add a new employee
const addEmployee = async () => {
  // Retrieve existing roles and managers from the database
  const roles = await db.query("SELECT id, title FROM roles;");
  const managers = await db.query("SELECT id, first_name, last_name FROM employees;");

  // Prompt user to enter employee details
  const employeeInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: "Enter employee's first name:",
    },
    {
      type: 'input',
      name: 'last_name',
      message: "Enter employee's last name:",
    },
    {
      type: 'list',
      name: 'roles_id',
      message: 'Choose employee role:',
      choices: roles[0].map(roles => ({ name: roles.title, value: roles.id })),
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Choose employee manager (optional):',
      choices: [
        ...managers[0].map(manager => ({ name: `${manager.first_name} ${manager.last_name}`, value: manager.id })),
        { name: 'None', value: null } // Add "None" as an option
      ],
    },
  ]);

  // Insert new employee into the employees table
  await db.query("INSERT INTO employees SET ?", employeeInfo);
  console.log('Employee added successfully!');
  await startApplication(); // Restart the application
};

const updateEmployeeRole = async () => {
  const employees = await db.query("SELECT id, first_name, last_name FROM employees;");
  const roles = await db.query("SELECT id, title FROM roles;");

  const updateInfo = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Choose employee to update:',
      choices: employees[0].map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })),
    },
    {
      type: 'list',
      name: 'roles_id',
      message: 'Choose new role:',
      choices: roles[0].map(role => ({ name: role.title, value: role.id })),
    },
  ]);

  await db.query("UPDATE employees SET roles_id = ? WHERE id = ?", [updateInfo.roles_id, updateInfo.employee_id]);
  console.log('Employee role updated successfully!');
  await startApplication();
};

// Function to update employee manager
const updateEmployeeManager = async () => {
  // Retrieve existing employees from the database
  const employees = await db.query("SELECT id, first_name, last_name FROM employees;");

  // Prompt user to choose an employee and a new manager
  const updateInfo = await inquirer.prompt([
    {
      type: 'list',
      name: 'employees_id',
      message: 'Choose employee to update:',
      choices: employees[0].map(employees => ({ name: `${employees.first_name} ${employees.last_name}`, value: employees.id })),
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Choose new manager:',
      choices: [
        ...employees[0].map(manager => ({ name: `${manager.first_name} ${manager.last_name}`, value: manager.id })),
        { name: 'None', value: null } // Add "None" as an option
      ],
    },
  ]);

  // Update employee's manager in the employees table
  await db.query("UPDATE employees SET manager_id = ? WHERE id = ?", [updateInfo.manager_id, updateInfo.employee_id]);
  console.log('Employee manager updated successfully!');
  await startApplication(); // Restart the application
};

// Function to view employees by manager
const viewEmployeesByManager = async () => {
  // Retrieve existing managers from the database
  const managers = await db.query("SELECT id, first_name, last_name FROM employees;");

  // Prompt user to choose a manager
  const managerInfo = await inquirer.prompt({
    type: 'list',
    name: 'manager_id',
    message: 'Choose manager to view employees:',
    choices: [
      ...managers[0].map(manager => ({ name: `${manager.first_name} ${manager.last_name}`, value: manager.id })),
      { name: 'None', value: null } // Add "None" as an option
    ],
  });

  // Retrieve employees managed by the selected manager from the database
  const [results] = await db.query("SELECT * FROM employees WHERE manager_id = ?", managerInfo.manager_id);
  const data = results.map(row => Object.values(row));
  data.unshift(["id", "first_name", "last_name", "roles_id", "manager_id"]);
  console.log(table(data)); // Display data in table format
  await startApplication(); // Restart the application
};

// Function to view employees by department
const viewEmployeesByDepartment = async () => {
  // Retrieve existing departments from the database
  const departments = await db.query("SELECT id, name FROM departments;");

  // Prompt user to choose a department
  const departmentInfo = await inquirer.prompt({
    type: 'list',
    name: 'department_id',
    message: 'Choose department to view employees:',
    choices: departments[0].map(department => ({ name: department.name, value: department.id })),
  });

  // Retrieve employees belonging to the selected department from the database
  const [results] = await db.query("SELECT * FROM employees WHERE roles_id IN (SELECT id FROM roles WHERE departments_id = ?)", departmentInfo.department_id);
  const data = results.map(row => Object.values(row));
  data.unshift(["id", "first_name", "last_name", "roles_id", "manager_id"]);
  console.log(table(data)); // Display data in table format
  await startApplication(); // Restart the application
};

// Function to delete an employee
const deleteEmployee = async () => {
  // Retrieve existing employees from the database
  const employees = await db.query("SELECT id, first_name, last_name FROM employees;");

  // Prompt user to choose an employee to delete
  const employeeInfo = await inquirer.prompt({
    type: 'list',
    name: 'employee_id',
    message: 'Choose employee to delete:',
    choices: employees[0].map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })),
  });

  // Delete selected employee from the employees table
  await db.query("DELETE FROM employees WHERE id = ?", employeeInfo.employee_id);
  console.log('Employee deleted successfully!');
  await startApplication(); // Restart the application
};

// Function to delete a department
const deleteDepartment = async () => {
  // Retrieve existing departments from the database
  const departments = await db.query("SELECT id, name FROM departments;");

  // Prompt user to choose a department to delete
  const departmentInfo = await inquirer.prompt({
    type: 'list',
    name: 'department_id',
    message: 'Choose department to delete:',
    choices: departments[0].map(department => ({ name: department.name, value: department.id })),
  });

  // Delete selected department from the departments table
  await db.query("DELETE FROM departments WHERE id = ?", departmentInfo.department_id);
  console.log('Department deleted successfully!');
  await startApplication(); // Restart the application
};

// Function to delete a role
const deleteRole = async () => {
  // Retrieve existing roles from the database
  const roles = await db.query("SELECT id, title FROM roles;");

  // Prompt user to choose a role to delete
  const roleInfo = await inquirer.prompt({
    type: 'list',
    name: 'roles_id',
    message: 'Choose role to delete:',
    choices: roles[0].map(role => ({ name: role.title, value: role.id })),
  });

  // Delete selected role from the roles table
  await db.query("DELETE FROM roles WHERE id = ?", roleInfo.roles_id);
  console.log('Role deleted successfully!');
  await startApplication(); // Restart the application
};

// Function to view department budget
const viewDepartmentBudget = async () => {
  // Retrieve existing departments from the database
  const departments = await db.query("SELECT id, name FROM departments;");

  // Prompt user to choose a department to view budget
  const departmentInfo = await inquirer.prompt({
    type: 'list',
    name: 'department_id',
    message: 'Choose department to view budget:',
    choices: departments[0].map(department => ({ name: department.name, value: department.id })),
  });

  // Calculate and display total budget for the selected department
  const [results] = await db.query("SELECT SUM(salary) AS total_budget FROM employees JOIN roles ON employees.roles_id = roles.id WHERE roles.departments_id = ?", departmentInfo.department_id);
  console.log(`Total budget for ${departments[0].find(department => department.id === departmentInfo.department_id).name}: $${results[0].total_budget}`);
  await startApplication(); // Restart the application
};

// Call the startApplication function to initiate the program
startApplication();
