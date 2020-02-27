var inquirer = require("inquirer");
var cTable = require('console.table');
var mysql = require("mysql");

var employeeData = [];
var departmentData = [];
var roleData = [];
var roleChoice = [];
var depChoice = [];
var managerList = [];
var managerChoice = []


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "tracker_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    getManagerData();
    getEmpData();
    getDepData();
    getRoleData();

    init();
});

function getEmpData() {
    var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name, ";
    query += "CONCAT(manager.first_Name, ' ', manager.last_name) AS 'manager' FROM employee ";
    query += "LEFT JOIN role ON employee.role_id = role.id ";
    query += "LEFT JOIN department ON role.department_id = department.id ";
    query += "LEFT JOIN employee AS manager ON employee.manager_id= manager.id ";

    connection.query(query, function(err, res) {
        if (err) throw err;
        //console.log(res);
        employeeData = [];
        for (let i = 0; i < res.length; i++) {
            employeeData.push(res[i]);
        }
    });
};

function getDepData() {
    var query = "SELECT id, department_name FROM department";
    connection.query(query, function(err, res) {
        if (err) throw err;
        departmentData = [];
        depChoice = [];
        for (let i = 0; i < res.length; i++) {
            departmentData.push(res[i]);
            depChoice.push(res[i].department_name);
        }
        // console.log(depChoice);
    });

};

function getRoleData() {
    var query = "SELECT role.id, role.title, role.salary, department.department_name ";
    query += "FROM role ";
    query += "LEFT JOIN department ON role.department_id = department.id ";

    connection.query(query, function(err, res) {
        if (err) throw err;
        roleData = [];
        roleChoice = [];
        for (let i = 0; i < res.length; i++) {
            roleData.push(res[i]);
            // console.log(res[i].title);
            roleChoice.push(res[i].title);
        }
    });
};

function getManagerData() {
    var query = "SELECT DISTINCT manager.id, manager.first_name, manager.last_name ";
    query += "FROM employee ";
    query += "LEFT JOIN role ON employee.role_id = role.id ";
    query += "LEFT JOIN department ON role.department_id = department.id ";
    query += "LEFT JOIN employee AS manager ON employee.manager_id = manager.id ";
    query += "GROUP BY id"

    connection.query(query, function(err, res) {
        if (err) throw err;
        //console.log(res);
        managerList = []
        for (let i = 1; i < res.length; i++) {
            managerList.push(res[i]);
            managerChoice.push(res[i].first_name + " " + res[i].last_name)
        }
    });
};

const startQ = [{
    name: "start",
    type: "list",
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
}];

async function init() {

    inquirer.prompt(startQ).then(function(answer) {
        // console.log("inside");
        switch (answer.start) {
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
                choices: managerChoice
            }
        ])
        .then(function(answer) {
            // console.log(roleData)
            var chosenManager = 0;
            for (var i = 0; i < managerList.length; i++) {
                var temp = managerList[i].first_name + " " + managerList[i].last_name;
                if (temp == answer.manager_id) {
                    chosenManager = managerList[i].id;
                };
            };

            var chosenRole = 0;
            for (var i = 0; i < roleData.length; i++) {
                if (roleData[i].title == answer.role) {
                    chosenRole = roleData[i].id;
                };
            };

            var query = connection.query(
                "INSERT INTO employee SET ?", {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: chosenRole,
                    manager_id: chosenManager
                },
                function(err, res) {
                    if (err) throw err;
                    console.log("Added a new employee!")
                }
            );
            getManagerData();
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
                    department_name: answer.department_name
                },
                function(err, res) {
                    if (err) throw err;
                    console.log("Added a new employee!")
                }
            );

            getDepData();
            init();
        });
};

async function addRoleInfo() {
    // console.log(departmentData);
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
            var chosenDep = 0;
            for (var i = 0; i < departmentData.length; i++) {
                if (departmentData[i].department_name == answer.department_id) {
                    chosenDep = departmentData[i].id;
                };
            };
            //  console.log(chosenDep);
            var query = connection.query(
                "INSERT INTO role SET ?", {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: chosenDep
                },
                function(err, res) {
                    if (err) throw err;
                    console.log("Added a new role!")
                }
            );
            getRoleData();
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
                name: "name_select",
                type: "rawlist",
                message: "Which role you want to update?",
                choices: roleChoice
            },
            {
                name: "salary",
                type: "input",
                message: "What's the role's new salary?"
            },
            {
                name: "department_id",
                type: "rawlist",
                message: "What's the role's new department?",
                choices: depChoice
            }
        ])
        .then(function(answer) {
            var chosenDep = 0;
            for (var i = 0; i < departmentData.length; i++) {
                if (departmentData[i].department_name == answer.department_id) {
                    chosenDep = departmentData[i].id;
                };
            };
            var query = connection.query(
                "UPDATE role SET ? WHERE ?", [{
                        salary: answer.salary,
                        department_id: chosenDep
                    },
                    {
                        title: answer.name_select
                    }
                ],
                function(err, res) {
                    if (err) throw err;
                    console.log("Updated a role!");

                }

            );
            getRoleData();
            init();
        });

};