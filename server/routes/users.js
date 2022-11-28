const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");

let connection = require("../database");

const {sign} = require('jsonwebtoken');

router.post("/", validateToken, async (req, res) => {
    console.log(req.body);
    let sql = `INSERT INTO users (username, password, email) VALUES ('${req.body.formData.username}', '${req.body.formData.password}', '${req.body.formData.email}')`;
    connection
    .query
    (sql, function (err, result) {
        if (err) return res.status(400).json({auth: true, error: err});
        console.log("1 record inserted");
        return res.json({auth: true, message: "User created"});
    });
});

router.post("/deleteUsers", validateToken, async (req, res) => {
    console.log(req.body);
    let sql = "DELETE FROM users WHERE id IN (" + req.body.formData + ")";
    connection
    .query
    (sql, function (err, result) {
        if (err) return res.status(400).json({auth: true, error: "Error Deleting Users"});
        console.log("Number of records deleted: " + result.affectedRows);
        return res.json({auth: true, message: "Users deleted"});
    });
});


router.get("/getUsers", validateToken, async (req, res) => {
    console.log(req.body);
    let sql = "SELECT * FROM users";
    connection
    .query
    (sql, function (err, result) {
        if (err) return res.status(400).json({auth: true, error: "Error Getting Users"});
        console.log("Number of records deleted: " + result.affectedRows);
        return res.json(result);
    });
});

router.post("/updateUser", validateToken, async (req, res) => {
    console.log(req.body);
    let sql = "UPDATE users SET name = '" + req.body.formData.name + "', email = '" + req.body.formData.email + "', password = '" + req.body.formData.password + "' WHERE id = " + req.body.formData.id;
    connection
    .query
    (sql, function (err, result) {
        if (err) return res.status(400).json({auth: true, error: "Error Updating User"});
        console.log("Number of records deleted: " + result.affectedRows);
        return res.json({auth: true, message: "User updated"});
    });
});

router.post("/login", async (req, res) => {
    console.log(req.body);
    let sql = "SELECT * FROM users WHERE email = '" + req.body.email + "' AND password = '" + req.body.password + "'";
    connection
    .query
    (sql, function (err, result) {
        if (err) return res.status(400).json({auth: false, error: "Error Logging In"});
        console.log("Number of records deleted: " + result.affectedRows);
        if (result.length > 0) {
            const accessToken = sign({id: result[0].id}, process.env.JWT_SECRET, {expiresIn: "1h"});
            return res.json({auth: true, token: accessToken, user: result[0]});
        } else {
            return res.status(401).json({auth: false, message: "Incorrect email or password"});
        }
    });
});


module.exports = router;