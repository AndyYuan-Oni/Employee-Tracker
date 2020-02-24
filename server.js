var inquirer = require("inquirer");
var cTable = require('console.table');
var mysql = require("mysql");

var employeeData = [];
var departmentData = [];
var roleData = [];
var roleChoice = [];
var depChoice = [];
var managerList = ["null"];


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "tracker_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    getEmpData();
    getDepData();
    getRoleData();
    init();
});

function getEmpData() {
    var query = "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.id, role.title, role.salary, role.department_id, department.id, department.name ";
    query += "CONCAT(m.last_Name, ', ', m.first_Name) AS manager FROM employee";
    query += "INNER JOIN employee m ON m.id = employee.manager_id";
    query += "LEFT JOIN roles ON employee.role_id = roles.id ";
    query += "LEFT JOIN department ON role.department_id = department.id ";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (let i = 0; i <= res.length; i++) {
            employeeData.push(res[i]);
            managerList.push(res[i].manager);
        }
    });
};

function getDepData() {
    var query = "SELECT department.id, department.name";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (let i = 0; i <= res.length; i++) {
            departmentData.push(res[i]);
            depChoice.push(res[i].title);
        }
    });
};

function getRoleData() {
    var query = "SELECT role.id, role.title, role.salary, role.department_id, department.id, department.name";
    query += "LEFT JOIN department ON role.department_id = department.id ";

    connection.query(query, function(err, res) {
        if (err) throw err;
        for (let i = 0; i <= res.length; i++) {
            roleData.push(res[i]);
            roleChoice.push(res[i].title);
        }
    });
};

function getRoleData() {
    var query = "SELECT role.id, role.title, role.salary, role.department_id, department.id, department.name";
    query += "LEFT JOIN department ON role.department_id = department.id ";

    connection.query(query, function(err, res) {
        if (err) throw err;
        for (let i = 0; i <= res.length; i++) {
            roleData.push(res[i]);
            roleChoice.push(res[i].title);
        }
    });
};

function init() {
    console.log("inside")
    inquirer.prompt({
        type: "list",
        name: "actions",
        message: "What would you like to do?",
        choices: [
            "Add departments",
            "Add roles",
            "Add employees",
            "View departments",
            "View roles",
            "View employees",
            "Update employee roles",
            "Exit"
        ]
    }).then(function(answer) {
        switch (answer.actions) {

            case "Add departments":
                addDepInfo();
                break;

            case "Add roles":
                addRoleInfo();
                break;

            case "Add employees":
                addEmpInfo();
                break;

            case "View departments":
                viewDepInfo();
                break;

            case "View roles":
                viewRoles();
                break;

            case "View employees":
                viewEmplyees();
                break;

            case "Update employee roles":
                updateEmpRoles();
                break;

            case "Exit":
                connection.end();
                break;
        }
    });
};


async function addEmpInfo() {
    inquirer
        .prompt([{
                name: "first_name",
                type: "input",
                message: "What's the emplyee's first name?"
            },
            {
                name: "last_name",
                type: "input",
                message: "What's the emplyee's last name?"
            },
            {
                name: "role",
                type: "list",
                message: "What's the employee's role?",
                choices: roleChoice
            },
            {
                name: "manager_id",
                type: "list",
                message: "What's the employee's manager?",
                choices: managerList
            }
        ])
        .then(function(answer) {
            var query = connection.query(
                "INSERT INTO employee SET ?", {
                    first_name: res.first_name,
                    last_name: res.last_name,
                    role_id: res.role_id,
                    manager_id: res.manager_id
                },
                function(err, res) {
                    if (err) throw err;
                    console.log("Added a new employee!")
                }
            );
            getEmpData();
            init();
        });
};

async function addDepInfo() {
    inquirer
        .prompt([{
            name: "department_name",
            type: "input",
            message: "What's the new department name?"
        }])
        .then(function(answer) {
            var query = connection.query(
                "INSERT INTO department SET ?", {
                    name: res.department_name
                },
                function(err, res) {
                    if (err) throw err;
                    console.log("Added a new employee!")
                }
            );
            init();
        });
};

async function addRoleInfo() {
    inquirer
        .prompt([{
                name: "title",
                type: "input",
                message: "What's the new role's title?"
            },
            {
                name: "salary",
                type: "input",
                message: "What's the new role's salary?"
            },
            {
                name: "department_id",
                type: "list",
                message: "What's the new role's department?",
                choices: depChoice
            }
        ])
        .then(function(answer) {
            var query =
                init();
        });
};

async function viewDepInfo() {
    console.table(departmentData);
    init();
};

async function viewRoles() {
    console.table(roleData);
    init();
};

async function viewEmplyees() {
    console.table(employeeData);
    init();
};

async function updateEmpRoles() {
    inquirer
        .prompt([{
                name: "title",
                type: "input",
                message: "What's the updated role's title?"
            },
            {
                name: "salary",
                type: "input",
                message: "What's the updated role's salary?"
            },
            {
                name: "department_id",
                type: "rawlist",
                message: "What's the updated role's department?",
                choices: depChoice
                    // choices: [
                    //     "Sales",
                    //     "Finance",
                    //     "Engineering",
                    //     "Legalr"
                    // ]
            }
        ])
        .then(function(answer) {
            var query = query = connection.query(
                "UPDATE role SET ? WHERE ?", [{
                        title: res.priceBid
                    },
                    {
                        id: res.id
                    }
                ],
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " products updated!\n");
                    // Call deleteProduct AFTER the UPDATE completes
                }

            );
            init();
        });

};