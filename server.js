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
                    d.name AS DEPARTMENT,
                    CONCAT('$', FORMAT(r.salary, 2)) AS SALARY
                FROM role r JOIN department d
                ON r.department_id = d.id`; 

    db.promise().query(sql).then(([rows, fields]) => {
      console.table(rows);
      return promptUser();
    });
};

const add_role = () => {
    inquirer.prompt(role_prompt)
        .then(answer => {
            const sql1 = `SELECT id FROM department WHERE name = '${answer.department}'`;
            db.promise().query(sql1).then(([rows, fields]) => {
                // console.log(rows[0].id);

                const sql2 = `INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`;

                const params = [ answer.title, answer.salary, rows[0].id ];

                db.query(sql2, params, (err, row) => {
                    if (err) {
                        console.log("error: " + err.message);
                    }
                    display_all_roles(true);
                });
            });
    });
};

const display_all_employees = ((isUpdatedTable, isUpdatedRole) => {
    const txt = isUpdatedTable ? "UPDATED" : "all";
    console.log(`\n*** Displaying ${txt} Employees ***\n`);

    const q1 = `WITH managers AS (
                    SELECT id, CONCAT(first_name, ' ', last_name) MANAGER
                    FROM employee
                )
                SELECT
                    e.id AS ID,
                    CONCAT(e.first_name, ' ', e.last_name) EMPLOYEE,
                    r.title AS TITLE,
                    d.name AS DEPARTMENT,
                    r.salary AS SALARY,
                    m.MANAGER
                FROM ((employee e
                    JOIN role r ON e.role_id = r.id)
                    JOIN department d ON d.id = r.department_id
                    JOIN managers m ON e.manager_id = m.id);`;

    const q2 = `WITH managers AS (
                SELECT id, CONCAT(first_name, ' ', last_name) MANAGER
                FROM employee
                )
                SELECT
                    e.id AS ID,
                    CONCAT(e.first_name, ' ', e.last_name) EMPLOYEE,
                    r.title AS TITLE,
                    d.name AS DEPARTMENT,
                    r.salary AS SALARY,
                    m.MANAGER
                FROM ((employee e
                    JOIN role r ON e.role_id = r.id)
                    JOIN department d ON d.id = r.department_id
                    JOIN managers m ON e.manager_id = m.id);`;

    const sql = isUpdatedRole ? q2 : q1;

    db.promise().query(sql).then(([rows, fields]) => {

      console.table(rows);
      return promptUser();
    });
});

const add_employee = () => {
    inquirer.prompt(employee_prmpt)
        .then(answer => {


            const sql1 = `SELECT id FROM role WHERE title = '${answer.role}'`;
            db.promise().query(sql1).then(([rows1, fields1]) => {

                const sql2 = `SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = '${answer.manager}'`;
                db.promise().query(sql2).then(([rows2, fields2]) => {

                const params = [ answer.first_name, answer.last_name, rows1[0].id, rows2[0].id ];
                // console.log(params);

                const sql3 = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`;
                db.query(sql3, params, (err, row) => {
                    if (err) {
                        console.log("error: " + err.message);
                    }
                    display_all_employees(true, false);
                })

                });

            });
        })
};

promptEmployeeUpdate = function(emp_list) {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee would you like to update?',
            choices: emp_list
        },
        {
            type: 'input',
            name: 'role',
            message: 'What is the new role?',
            validate: (role) => {
                if (role) {
                    return true;
                } else {
                    console.log("Please provide the employee's new role");
                    return false;
                }
            }
        }
    ])
};

const update_employee = () => {

    // console.log("updating employee");

    let employees = [];
    let id, updateable_empl, new_role;
    const idPattern = /^[^\d]*(\d+)/;
    const sql1 = `SELECT CONCAT(id, '-', first_name, ' ', last_name) AS employee FROM employee`;
    db.promise().query(sql1).then(([rows]) => {
        for(let i = 0; i < rows.length; i++)
            employees.push(rows[i].employee);

        // console.log(employees);
        promptEmployeeUpdate(employees).then((answers) => {
            updateable_empl = answers.employee;
            new_role = answers.role;
            // console.log(`${updateable_empl}: ${new_role}`);
            if(idPattern.test(updateable_empl))
                id = idPattern.exec(updateable_empl);
            // console.log(id[0]);
            return [ new_role, id[0] ];
         })
        .then((answers) => {

            // console.log(answers);
            // console.log(answers[0]);
            // console.log(answers[1]);

            const sql2 = `SELECT id FROM role WHERE title = '${answers[0]}'`;
            db.promise().query(sql2).then(([rows2, fields2]) => {

            const params = [ rows2[0].id, answers[1] ];
            // console.log(params);


            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                db.query(sql, params, (err, row) => {
                    if (err) {
                        // console.log("error: " + err.message);
                    }
                    display_all_employees(true, true);
                });
            });
        });
    })
};

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