const intial_prompt = [
    {
        type: "list",
        name: "initial_options",
        message: "Please select an option.",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Exit"
        ],
        default: "Exit"
    }
];

const department_prompt = [
    {
        type: "input",
        name: "department",
        message: "Please provide the department name",
        validate: (department) => {
            if (department) {
              return true;
            } else {
              console.log("Please provide a name for the department");
              return false;
            }
        }
    }
];

const employee_prmpt = [
    {
        type: "input",
        name: "first_name",
        message: "Please provide the employee's first name",
        validate: (first_name) => {
            if (first_name) {
                return true;
            } else {
                console.log("Please provide the employee's first name");
                return false;
            }
         },
    },
    {
        type: "input",
        name: "last_name",
        message: "Please provide the employee's last name",
        validate: (last_name) => {
            if (last_name) {
                return true;
            } else {
                console.log("Please provide the employee's last name");
                return false;
            }
        }
    },
    {
        type: "input",
        name: "role",
        message: "Please provide the employee's role",
        validate: (role) => {
            if (role) {
                return true;
            } else {
                console.log("Please provide the employee's role");
                return false;
            }
        }
    },
    {
        type: "input",
        name: "manager",
        message: "Please provide the first and last name of the employee's manager ",
        validate: (manager) => {
            if (manager) {
                return true;
            } else {
                console.log("Please provide the first and last name of the employee's manager");
                return false;
            }
        }
    }
];

const role_prompt = [
    {
        type: "input",
        name: "title",
        message: "Please provide the name for the new role",
        validate: (title) => {
            if (title) {
                return true;
            } else {
                console.log("Please provide the name for the new role");
                return false;
            }
        }
    },
    {
        type: "input",
        name: "salary",
        message: "Please provide the salary for the role",
        validate: (salary) => {
            if (salary) {
                return true;
            } else {
                console.log("Please provide the salary for the role");
                return false;
            }
        }
    },
    {
        type: "input",
        name: "department",
        message: "Please provide the role's department name",
        validate: (department) => {
            if (department) {
                return true;
            } else {
                console.log("Please provide the role's department name");
                return false;
            }
        }
    },
];

module.exports = {
    intial_prompt,
    department_prompt,
    employee_prmpt,
    role_prompt
};