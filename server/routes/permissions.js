const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const brcypt = require("bcrypt");
const multer = require("multer");

let connection = require("../database");

const { sign, verify } = require('jsonwebtoken');

router.get("/getPermissions", validateToken, (req, res) => {
    connection.query(
        "SELECT * FROM permissions",
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
                    message: "Permissions found",
                    data: results,
                });
                return;
            }
        }
    );
});

router.get("/getUserPermissions", validateToken, (req, res) => {
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
                    "SELECT * FROM role_has_permission, permissions WHERE user_id = ? and role_has_permission.permission_id = permissions.id",
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
                                data: results
                            });
                        }
                    }
                );
            }
        });
    }
});

router.get("/getAllUserPermissions", validateToken, (req, res) => {
    connection.query(
        "SELECT user_pr.id, user_pr.phone, user_pr.first_name, user_pr.last_name, user_pr.designation, user_pr.email, permissions.name as 'permissions_name' FROM user_pr left join role_has_permission on user_pr.id = role_has_permission.user_id left join permissions on role_has_permission.permission_id = permissions.id",
        async (error, results) => {
            if (results.length == 0) {
                res.json({
                    status: false,
                    message: "No permissions found",
                });
            }
            else {
                res.json({
                    status: true,
                    message: "Permissions found",
                    data: results
                });
            }
        }
    );
});

router.post("/updatePermissions", validateToken, (req, res) => {
    const {id, permissions_id} = req.body;
    connection.query(
        "UPDATE role_has_permission SET permission_id = ? WHERE user_id = ?",
        [permissions_id, id],
        async (error, results) => {
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
                    message: "Permissions updated successfully",
                });
                return;
            }
        }
    );
});

module.exports = router;