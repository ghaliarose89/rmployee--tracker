const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./db/connection');
startApp();
function startApp() {
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
}

async function showDepartment() {

}
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
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.dep_name
  AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
   FROM employee LEFT JOIN role on employee.role_id = role.id 
   LEFT JOIN department on role.department_id = department.id 
   LEFT JOIN employee manager on manager.id = employee.manager_id;
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
  let dep = [];
  db.query((`SELECT * FROM department`), (err, rows) => {
    if (err) console.log(err);
    console.log(rows);
    dep = rows.map(rows => ({ name: rows.dep_name, value: rows.id }));
    console.log(dep);
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
        name: 'depChoice',
        message: "Please Choose the Department for this role",
        choices: dep,

      },
    ])
      .then(data => {
        console.log(data);
        const roleName = data.roleName;
        const depName = data.depChoice;
        const salaryNum = data.salaryNum;

        const sql = `INSERT INTO role (title,salary ,department_id) valueS (?,?,?) `;
        const value = [roleName, salaryNum, depName];
        db.query(sql, value, (err, rows) => {
          if (err) throw err;
          console.log('New Role has been created');
        })
      });

  });


};

function UpdateEmployee(){
  let role  = [];
  let manager = [];
  db.query((`SELECT title ,id  FROM role`), (err, rows) => {
    if (err) console.log(err);
    role = rows.map(rows => ({ name: rows.title , value: rows.id}));
    console.log (role);
    const sql = `SELECT first_name, last_name, id FROM employee WHERE manager_id IS NULL`;
    db.query((sql), (err, rows) => {
      if (err) console.log(err);
      manager = rows.map(rows => ( { name: rows.first_name + ' '+rows.last_name ,value:rows.id } ));
      console.log (manager);
    
    inquirer.prompt([
      {
        type: "input",
        message: "Please enter the Employee first name",
        name: "employeeName",
      },

      {
        type: "input",
        message: "Please enter the Employee last name",
        name: "employeeLastName",
      },
      {
        type: "list",
        name: 'roleChoice',
        message: "Please Choose the Role for this employee",
        choices: role,

      },
      {
        type: "list",
        name: 'depChoice',
        message: "Please Choose a manager for this employee",
        choices: manager,

      },

    ])
      .then(data => {
        console.log(data);
        const firstName = data.employeeName;
        const lastName = data.employeeLastName;
        const roleChoice = data.roleChoice;
        const managervlaue = data.manager;
        const sql = `INSERT INTO employee (first_name ,last_name , role_id ,manager_id) valueS (?,?,?,?) `;
        const value = [firstName, lastName, roleChoice,managervlaue];
        db.query(sql, value, (err, rows) => {
          if (err) throw err;
          console.log('New Employee has been added');
        })
      });
    });
  });
};






function addEmployee() {
  let role  = [];
  let manager = [];
  db.query((`SELECT title ,id  FROM role`), (err, rows) => {
    if (err) console.log(err);
    role = rows.map(rows => ({ name: rows.title , value: rows.id}));
    console.log (role);
    const sql = `SELECT first_name, last_name, id FROM employee;`;
    db.query((sql), (err, rows) => {
      if (err) console.log(err);
      manager = rows.map(rows => ( { name: rows.first_name + ' '+rows.last_name ,value:rows.id } ));
      console.log (manager);
    
    inquirer.prompt([
      {
        type: "input",
        message: "Please enter the Employee first name",
        name: "employeeName",
      },

      {
        type: "input",
        message: "Please enter the Employee last name",
        name: "employeeLastName",
      },
      {
        type: "list",
        name: 'roleChoice',
        message: "Please Choose the Role for this employee",
        choices: role,

      },
      {
        type: "list",
        name: 'depChoice',
        message: "Please Choose a manager for this employee",
        choices: manager,

      },

    ])
      .then(data => {
        console.log(data);
        const firstName = data.employeeName;
        const lastName = data.employeeLastName;
        const roleChoice = data.roleChoice;
        const managervlaue = data.manager;
        console.log(managervlaue);
        const sql = `INSERT INTO employee (first_name ,last_name , role_id ,manager_id) valueS (?,?,?,?) `;
        const value = [firstName, lastName, roleChoice,managervlaue];
        db.query(sql, value, (err, rows) => {
          if (err) throw err;
          console.log('New Employee has been added');
        })
      });
    });
  });
};



db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
})

