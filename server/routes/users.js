const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const brcypt = require("bcrypt");

let connection = require("../database");

const { sign } = require('jsonwebtoken');

// router.post("/", validateToken, async (req, res) => {
//     console.log(req.body);
//     let sql = `INSERT INTO users (username, password, email) VALUES ('${req.body.formData.username}', '${req.body.formData.password}', '${req.body.formData.email}')`;
//     connection
//     .query
//     (sql, function (err, result) {
//         if (err) return res.status(400).json({auth: true, error: err});
//         console.log("1 record inserted");
//         return res.json({auth: true, message: "User created"});
//     });
// });

// router.post("/deleteUsers", validateToken, async (req, res) => {
//     console.log(req.body);
//     let sql = "DELETE FROM users WHERE id IN (" + req.body.formData + ")";
//     connection
//     .query
//     (sql, function (err, result) {
//         if (err) return res.status(400).json({auth: true, error: "Error Deleting Users"});
//         console.log("Number of records deleted: " + result.affectedRows);
//         return res.json({auth: true, message: "Users deleted"});
//     });
// });

// get details of all employees
router.get("/getEmployees", async (req, res) => {
    // console.log(req.body);
    let sql = "SELECT * FROM employee_details";
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        // console.log(result);
        return res.json(result);
    });
});

//get employee details by its id
router.get("/getEmployee/:id", async (req, res) => {
    let empId = req.params.id;
    let sql = `SELECT * FROM employee_details WHERE employee_id = ${empId}`;
    connection.query(sql, function(err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

// get all employees benefits
router.get("/getEmployeesBenefits", async (req, res) => {
    // console.log(req.body);
    let sql = "SELECT * FROM benefits";
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

//get employee benefits by its id
router.get("/getEmployeeBenefits/:id", async (req, res) => {
    let empId = req.params.id;
    connection.query(`SELECT * FROM benefits WHERE employee_id = ${empId}`, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

//get departments list by department_id
router.get("/getDepartments", async (req, res) => {
    let sql = "SELECT * FROM department";
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

//get departments list by department_id
router.get("/getDepartment/:id", async (req, res) => {
    let deptId = req.params.id;
    let sql = `SELECT * FROM department WHERE department_id = ${deptId}`;
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

//get all designations
router.get("/getDesignations", async (req, res) => {
    let sql = "SELECT * FROM designations";
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

//get designation by its designation_id
router.get("/getDesignation/:id", async (req, res) => {
    let desigId = req.params.id;
    let sql = `SELECT * FROM designations WHERE designation_id = ${desigId}`;
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

//get all disputes
router.get("/getDisputes", async (req, res) => {
    let sql = "SELECT * FROM disputes";
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

//get dispute by employee_id
router.get("/getDispute/:id", async (req, res) => {
    let empId = req.params.id;
    let sql = `SELECT * FROM disputes WHERE employee_id = ${empId}`;
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

// get all employees attendence
router.get("/getEmployeesAttendence", async (req, res) => {
    let sql =  `SELECT * from employee_attendence`;
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

//get employee attendence by its employee_id
router.get("/getEmployeeAttendence/:id", async (req, res) => {
    let empId = req.params.id;
    let sql = `SELECT * FROM employee_attendence WHERE employee_id = ${empId}`;
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

//get all employees documents
router.get("/getEmployeesDocuments", async (req, res) => {
    let sql =  `SELECT * from employee_documents`;
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

//get employee documents by its employee_id
router.get("/getEmployeeDocuments/:id", async (req, res) => {
    let empId = req.params.id;
    let sql = `SELECT * FROM employee_documents WHERE employee_id = ${empId}`;
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

// get all employees leaves
router.get("/getEmployeesLeaves", async (req, res) => {
    let sql =  `SELECT * from employee_leaves`;
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

//get employee leaves by its employee_id
router.get("/getEmployeeLeaves/:id", async (req, res) => {
    let empId = req.params.id;
    let sql = `SELECT * FROM employee_leaves WHERE employee_id = ${empId}`;
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

// get all leave requests
router.get("/getLeaveRequests", async (req, res) => {
    let sql =  `SELECT * from leave_requests`;
    connection.query(sql, function(err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

//get leave request by its employee_id
router.get("/getLeaveRequest/:id", async (req, res) => {
    let empId = req.params.id;
    let sql = `SELECT * FROM leave_requests WHERE employee_id = ${empId}`;
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

//get all projects
router.get("/getProjects", async (req, res) => {
    let sql = "SELECT * FROM projects";
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

//get project by employee_id
router.get("/getProject/:id", async (req, res) => {
    let empId = req.params.id;
    let sql = `SELECT * FROM projects WHERE employee_id = ${empId}`;
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

// get all reminders
router.get("/getReminders", async (req, res) => {
    let sql =  `SELECT * from reminders`;
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

//get reminder by its employee_id
router.get("/getReminder/:id", async (req, res) => {
    let empId = req.params.id;
    let sql = `SELECT * FROM reminders WHERE employee_id = ${empId}`;
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

// get salary of all employees
router.get("/getEmployeesSalary", async (req, res) => {
    let sql =  `SELECT * from salary`;
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

//get salary of employee by its employee_id
router.get("/getEmployeeSalary/:id", async (req, res) => {
    let empId = req.params.id;
    let sql = `SELECT * FROM salary WHERE employee_id = ${empId}`;
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error Getting Users" });
        return res.json(result);
    });
});

//login for an employee
router.post("/login", async (req, res) => {
    var {employee_id, username, password} = req.body;
    // var salt = bcrypt.genSaltSync(12);
    // var hash = bcrypt.hashSync(value, salt);
    let sql = `INSERT INTO login (employee_id, username, password) VALUES ('${employee_id}', '${username}', '${password}')`;
    connection.query(sql, function (err, result) {
        if (err) return res.status(400).json({ auth: true, error: "Error in inserting login data" });
        return res.json(result);
    });
});

// router.post("/updateUser", validateToken, async (req, res) => {
//     console.log(req.body);
//     let sql = "UPDATE users SET name = '" + req.body.formData.name + "', email = '" + req.body.formData.email + "', password = '" + req.body.formData.password + "' WHERE id = " + req.body.formData.id;
//     connection
//     .query
//     (sql, function (err, result) {
//         if (err) return res.status(400).json({auth: true, error: "Error Updating User"});
//         console.log("Number of records deleted: " + result.affectedRows);
//         return res.json({auth: true, message: "User updated"});
//     });
// });

// router.post("/login", async (req, res) => {
//     console.log(req.body);
//     let sql = "SELECT * FROM users WHERE email = '" + req.body.email + "' AND password = '" + req.body.password + "'";
//     connection
//     .query
//     (sql, function (err, result) {
//         if (err) return res.status(400).json({auth: false, error: "Error Logging In"});
//         console.log("Number of records deleted: " + result.affectedRows);
//         if (result.length > 0) {
//             const accessToken = sign({id: result[0].id}, process.env.JWT_SECRET, {expiresIn: "1h"});
//             return res.json({auth: true, token: accessToken, user: result[0]});
//         } else {
//             return res.status(401).json({auth: false, message: "Incorrect email or password"});
//         }
//     });
// });


module.exports = router;