const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./db/connection');

inquirer.prompt(
  [
    {
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "update an employee role",
        "add an employee",
        "add a role",
        "add a department"
      ]
    }

  ])
  .then(data => {
    switch (data.choice) {
      case "view all departments":
        viewAllDep();
        break;
      case "view all roles":
        viewAllRoles();
        break;
      case "view all employees":
        viewAllEmployees();
        break;
      case "update an employee role":
        UpdateEmployee();
        break;
      case "add an employee":
        addEmployee();
        break;
      case "add a role":
        addRole();
        break;
      case "add a department":
        addDep();
        break;
    }
  });


function viewAllDep() {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, row) => {
    if (err) console.log(err);
    console.table(row);

  });
};
function viewAllRoles() {
  const sql = `SELECT  role.id, role.title, role.salary, department.dep_name AS Department_name 
    FROM role LEFT JOIN department 
    ON role.department_id = department.id; `;
  db.query(sql, (err, row) => {
    if (err) console.log(err);
    console.table(row);

  });
}
function viewAllEmployees() {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.dep_name AS department, 
  CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id 
  LEFT JOIN department ON role.department_id = department.id  left
  join employee e on employee.manager_id = e.id;
    `;
  db.query(sql, (err, row) => {
    if (err) console.log(err);
    console.table(row);

  });
}

function addDep() {
  inquirer.prompt(
    [{
      type: "input",
      message: "Enter the name of the department",
      name: "depName",
    }]
  ).then(data => {
    const depName = data.depName;
    const sql = `insert into department (dep_name) value (?);`;
    db.query(sql, depName, (err, row) => {
      if (err) console.log(err);
      console.table(depName + 'is added to the department table');

    });
  });

};


function addRole() {
  const  sql= `SELECT dep_name FROM department;`;
   db.query(sql,(err,rows)=>{
    if (err) throw err
    //console.table(rows);
    
  }).then(data =>{console.log(data)})
  //console.log(department);
  //query the data base for existing department 
  inquirer.prompt([
    {
      type: "input",
      message: "Please enter the Role name",
      name: "roleName",
    },

    {
      type: "input",
      message: "Enter  the Salary for this role",
      name: "salaryNum",
    },
    {
      type: "list",
      message: "Please Choose the Department for this role",
      choices: ['Management', 'Sales', 'HR', ],
      name:'depChoice',
    },
  ])
    .then(data => {
      const roleName = data.roleName;
      const depName = data.depChoice;
      const salaryNum = data.salaryNum;
      let dep_id=0;
      switch (depName) {
        case 'Management':
           dep_id = 1;
          break;
        case 'Sales':
           dep_id = 2;
          break;
        case 'HR':
           dep_id = 3;
          break;
        case 'Create a new department':
          addDep();
          break;

      };
      const sql = `INSERT INTO role (title,salary ,department_id) valueS (?,?,?) `;
      const value = [roleName, salaryNum, dep_id];
      db.query(sql, value, (err, rows) => {
        if (err) throw err;
        console.log('New department has been created');
      })
    });
};









db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
})

