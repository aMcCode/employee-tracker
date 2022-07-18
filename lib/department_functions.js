const db = require('../db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer'); 
const { department_prompt} = require("./questions");

function display_all_depts(isUpdate) {
    const txt = isUpdate ? "UPDATED" : "all";
    console.log(`\n*** Displaying ${txt} Depts ***\n`);

    const sql = `SELECT department.id AS ID, department.name AS DEPARTMENT FROM department`; 

    db.query(sql, (err, rows) => {
      if (err) {
        console.log("error: " + err.message);
        return;
      }
      console.table(rows);
    });
};

function add_department() {
    inquirer.prompt(department_prompt)
        .then(answer => {
            const sql = `INSERT INTO department (name)
            VALUES (?)`;

            db.query(sql, answer.department, (err, row) => {
                if (err) {
                    console.log("error: " + err.message);
                    return;
                }
            })
            display_all_depts();
        })
}

module.exports = { display_all_depts, add_department };