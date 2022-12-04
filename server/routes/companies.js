const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const brcypt = require("bcrypt");
const multer = require("multer");

let connection = require("../database");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })

router.get("/getCompanies", validateToken, (req, res) => {
    connection.query(
        "SELECT * FROM companies",
        (error, results) => {
            if (error) {
                res.json({
                    status: false,
                    message: "Error occured",
                });
            }
            else {
                res.json({
                    status: true,
                    data: results,
                });
            }
        }
    );
});

router.post("/updateCompany", validateToken, (req, res) => {
    const { id, name, location, phone, email } = req.body;
    connection.query(
        "UPDATE companies SET name = ?, location = ?, phone = ?, email = ? WHERE id = ?",
        [name, location, phone, email, id],
        (error, results) => {
            if (error) {
                res.json({
                    status: false,
                    message: "Error occured",
                });
            }
            else {
                res.json({
                    status: true,
                    message: "Company updated successfully",
                });
            }
        }
    );
});

router.post("/deleteCompany", validateToken, (req, res) => {
    const deleteID= req.body.id;
    //transaction
    connection.beginTransaction(function(err) {
        if (err) { throw err; }
        connection.query(
            "DELETE FROM companies WHERE id in ?",
            [[deleteID]],
            (error, results) => {
                if (error) {
                    connection.rollback(function() {
                        throw error;
                    });
                }
                connection.commit(function(err) {
                    if (err) {
                        connection.rollback(function() {
                            throw err;
                        });
                    }
                    res.json({
                        status: true,
                        message: "Company deleted successfully",
                    });
                });
            }
        );
    });
});

router.post("/addCompany", validateToken, (req, res) => {
    const { name, location, phone, email } = req.body;
    connection.query(
        "INSERT INTO companies (name, location, phone, email) VALUES (?, ?, ?, ?)",
        [name, location, phone, email],
        (error, results) => {
            if (error) {
                console.log(error);
                res.json({
                    status: false,
                    message: "Error occured",
                });
            }
            else {
                res.json({
                    status: true,
                    message: "Company added successfully",
                });
            }
        }
    );
});

module.exports = router;