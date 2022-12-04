const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const brcypt = require("bcrypt");
const multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniquePrefix + '-' + file.originalname)
    }
})

var upload = multer({ storage: storage })

let connection = require("../database");

const { sign, verify } = require('jsonwebtoken');

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    connection.query(
        "SELECT * FROM user_pr WHERE email = ?",
        [email],
        async (error, results) => {
            console.log(results);
            if (
                results.length == 0 ||
                !(await brcypt.compare(password, results[0].password))
            ) {
                res.json({
                    status: false,
                    message: "Invalid email or password",
                });
            }
            else {
                const id = results[0].id;
                const token = sign({ id }, process.env.JWT_SECRET, {
                expiresIn: '1hr'
                });
                res.json({
                    status: true,
                    message: "Login successful",
                    token: token
                });
            }
        }
    );
});

router.post("/updateUser", validateToken, async (req, res) => {
    const { id, first_name, last_name, email, phone, designation, permissions} = req.body;
    //transaction to insert into user and update role_has_permission
    connection.beginTransaction(function(err) {
        if (err) { throw err; }
        connection.query(
            "UPDATE user_pr SET first_name = ?, last_name = ?, email = ?, phone = ?, designation = ? WHERE id = ?",
            [first_name, last_name, email, phone, designation, id],
            async (error, results) => {
                if (error) {
                    console.log(error);
                    return connection.rollback(function() {
                        throw error;
                    });
                }
                else {
                    connection.query(
                        "DELETE FROM role_has_permission WHERE user_id = ?",
                        [id],
                        async (error, results) => {
                            if (error) {
                                console.log(error);
                                return connection.rollback(function() {
                                    throw error;
                                });
                            }
                            else {
                                connection.query(
                                    "INSERT INTO role_has_permission (user_id, permission_id) VALUES (?, ?)",
                                    [id, permissions],
                                    async (error, results) => {
                                        if (error) {
                                            console.log(error);
                                            return connection.rollback(function() {
                                                throw error;
                                            });
                                        }
                                        else {
                                            connection.commit(function(err) {
                                                if (err) {
                                                    return connection.rollback(function() {
                                                        throw err;
                                                    });
                                                }
                                                console.log('Transaction Complete.');
                                                res.json({
                                                    status: true,
                                                    message: "User updated"
                                                });
                                            });
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        );
    });
});

router.post("/addUser", validateToken, upload.single('file'), (req, res) => {
    var photo=null;
    if(req.file) photo=req.file.path;
    brcypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            console.log(err);
        }
        const { first_name, last_name, email, phone, designation} = req.body;
        connection.query(
        "INSERT INTO user_pr (photo, first_name, last_name, email, phone, password, designation) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [photo, first_name, last_name, email, phone, hash, designation],
        (error, results) => {
            if (error) {
                console.log(error);
                res.json({
                    status: false,
                    message: "Error occured",
                });
                return;
            }
            else {
                res.json({
                    status: true,
                    message: "User added successfully",
                });
                return;
            }
        }
    );
});
});

router.get("/getLoggedUser", validateToken, (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        res.json({
            status: false,
            message: "No token provided",
        });
    }
    else {
        verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.json({
                    status: false,
                    message: "Failed to authenticate token",
                });
            }
            else {
                connection.query(
                    "SELECT * FROM user_pr WHERE id = ?",
                    [decoded.id],
                    async (error, results) => {
                        if (results.length == 0) {
                            res.json({
                                status: false,
                                message: "Invalid user",
                            });
                        }
                        else {
                            res.json({
                                status: true,
                                message: "User found",
                                user: results[0]
                            });
                        }
                    }
                );
            }
        });
    }
});

router.get("/getAuth", async (req, res) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        res.json({
            status: false,
            message: "No token provided",
        });
    }
    else {
        verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.json({
                    status: false,
                    message: "Failed to authenticate token",
                });
            }
            else {
                res.json({
                    status: true,
                    message: "Token is valid",
                });
            }
        });
    }
});

module.exports = router;