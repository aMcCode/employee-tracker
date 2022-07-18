const inquirer = require('inquirer'); 
const cTable = require('console.table');
const db = require('./db/connection');
const { intial_prompt, department_prompt, employee_prmpt, role_prompt } = require('./lib/questions');

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    promptUser();
});


const display_all_depts = (isUpdate) => {
    const txt = isUpdate ? "UPDATED" : "all";
    console.log(`\n*** Displaying ${txt} Depts ***\n`);

    const sql = `SELECT department.id AS ID, department.name AS DEPARTMENT FROM department`; 

    db.promise().query(sql).then(([rows, fields]) => {
      
      console.table(rows);
      return promptUser();
    });
};

const add_department = () => {
    inquirer.prompt(department_prompt)
        .then(answer => {
            const sql = `INSERT INTO department (name)
            VALUES (?)`;

            db.query(sql, answer.department, (err, row) => {
                if (err) {
                    console.log("error: " + err.message);
                }
                display_all_depts(true);
            })
        })
}

const display_all_roles = (isUpdate) => {
    const txt = isUpdate ? "UPDATED" : "all";
    console.log(`\n*** Displaying ${txt} Roles ***\n`);

    const sql = `SELECT
                    r.id AS ID,
                    r.title AS TITLE,
                    r.salary AS SALARY,
                    d.name
                FROM role r JOIN department d
                ON r.department_id = d.id`; 

    db.promise().query(sql).then(([rows, fields]) => {

      console.table(rows);
      return promptUser();
    });
};

const add_role = () => {
    inquirer.prompt(department_prompt)
        .then(answer => {
            const sql = `INSERT INTO role (title, salary, department_id)
            VALUES (?, ?, ?)`;
        const params = [ answer.title, answer.salary, answer.department_id ];

            db.query(sql, params, (err, row) => {
                if (err) {
                    console.log("error: " + err.message);
                }
                display_all_roles(true);
            })
        })
}

const display_all_employees = (isUpdate) => {
    const txt = isUpdate ? "UPDATED" : "all";
    console.log(`\n*** Displaying ${txt} Employees ***\n`);

    const sql = `WITH managers AS (
                    SELECT id, CONCAT(first_name, ' ', last_name) MANAGER
                    FROM employee
                )
                SELECT
                    e.id AS ID,
                    CONCAT(e.first_name, ' ', e.last_name) EMPLOYEE,
                    r.title,
                    m.MANAGER
                FROM ((employee e
                    JOIN role r ON e.role_id = r.id)
                    JOIN managers m ON e.manager_id = m.id);`;

    db.promise().query(sql).then(([rows, fields]) => {

      console.table(rows);
      return promptUser();
    });
};

const add_employee = () => {
    inquirer.prompt(department_prompt)
        .then(answer => {
            const sql = `INSERT INTO role (first_name, last_name, role_id, manager_id)
            VALUES (?, ?, ?, ?)`;
        const params = [ answer.first_name, answer.last_name, answer.role_id, answer.manager_id ];

            db.query(sql, params, (err, row) => {
                if (err) {
                    console.log("error: " + err.message);
                }
                display_all_roles(true);
            })
        })
}

const update_employee = () => {
    console.log("updating employee");
}


promptUser = function() {
    inquirer.prompt(intial_prompt)
    .then((answers) => {
        if(answers.initial_options === "View all departments")
            display_all_depts(false);
        else if(answers.initial_options === "View all roles")
            display_all_roles(false);
        else if(answers.initial_options === "View all employees")
            display_all_employees(false);
        else if(answers.initial_options === "Add a role")
            add_role();
        else if(answers.initial_options === "Add a department")
            add_department();
        else if(answers.initial_options === "Add an employee")
            add_employee();
        else if(answers.initial_options === "Update an employee role")
            update_employee();
        else {
            console.log("Exiting...");
            db.end;
            process.exit();
        }
    });
};