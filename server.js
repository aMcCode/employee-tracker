const inquirer = require('inquirer'); 
const cTable = require('console.table');
const db = require('./db/connection');
const { display_all_depts, add_department } = require("./lib/department_functions");
const { intial_prompt } = require("./lib/questions");


function promptUser() {
    return inquirer.prompt(intial_prompt)
    .then((answers) => {

        if(answers.initial_options === "View all departments") {
            display_all_depts();
            promptUser();
        }
        else if(answers.initial_options === "View all roles") {

        }
        else if(answers.initial_options === "View all employees") {

        }
        else if(answers.initial_options === "Add a role") {

        }
        else if(answers.initial_options === "Add a department") {
            add_department();
            promptUser();
        }
        else if(answers.initial_options === "Add an employee") {

        }
        else if(answers.initial_options === "Update an employee role") {

        }
        else {
            console.log("Exiting...");
            db.end;
            process.exit();
        }
    });

};


db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    promptUser();
});

