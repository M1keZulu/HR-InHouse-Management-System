const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const brcypt = require("bcrypt");
const multer = require("multer");
const fs = require('fs');

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

router.post("/uploadFile", validateToken, upload.single('file'), async (req, res) => {
    const token = req.headers["x-access-token"];
    const decoded = verify(token, process.env.JWT_SECRET);
    const id = decoded.id;
    const file = req.file;
    console.log(file);
    connection.query(
        "INSERT into user_files (user_id, file_name, path) VALUES (?, ?, ?)",
        [id, file.originalname, file.path],
        async (error, results) => {
            if (error) {
                console.log(error);
                res.json({
                    status: false,
                    message: "Error uploading file"
                });
            }
            else {
                res.json({
                    status: true,
                    message: "File uploaded"
                });
            }
        }
    );
});

router.post("/shareFile", validateToken, async (req, res) => {
    const { file_id, shared } = req.body;
    const token = req.headers["x-access-token"];
    const decoded = verify(token, process.env.JWT_SECRET);
    const from_id = decoded.id;
    //map shared to different rows
    var insert_values = [];
    for (var i = 0; i < shared.length; i++) {
        insert_values.push([file_id, shared[i], from_id]);
    }
    connection.query(
        "INSERT into file_share VALUES ?",
        [insert_values],
        async (error, results) => {
            if (error) {
                console.log(error);
                res.json({
                    status: false,
                    message: "Error sharing file"
                });
            }
            else {
                res.json({
                    status: true,
                    message: "File shared"
                });
            }
        }
    );
});

router.get("/getFiles", validateToken, async (req, res) => {
    const token = req.headers["x-access-token"];
    const decoded = verify(token, process.env.JWT_SECRET);
    const id = decoded.id;
    connection.query(
        "SELECT * FROM user_files WHERE user_id = ?",
        [id],
        async (error, results) => {
            if (error) {
                console.log(error);
                res.json({
                    status: false,
                    message: "Error getting files"
                });
            }
            else {
                res.json({
                    status: true,
                    message: "Files retrieved",
                    data: results
                });
            }
        }
    );
});

router.get('/getSharedFiles', validateToken, async (req, res) => {
    const token = req.headers["x-access-token"];
    const decoded = verify(token, process.env.JWT_SECRET);
    const id = decoded.id;
    connection.query(
        "SELECT user_files.id, user_files.user_id, user_files.file_name, user_files.path, user_pr.first_name, user_pr.last_name FROM user_files, file_share, user_pr WHERE user_files.id IN (SELECT file_share.file_id FROM file_share WHERE file_share.to_id = ?) AND user_files.id = file_share.file_id and user_pr.id = from_id",
        [id],
        async (error, results) => {
            if (error) {
                console.log(error);
                res.json({
                    status: false,
                    message: "Error getting files"
                });
            }
            else {
                console.log(results);
                res.json({
                    status: true,
                    message: "Files retrieved",
                    data: results
                });
            }
        }
    );
}); 

router.post("/deleteFile", validateToken, async (req, res) => {
    const { file_id } = req.body;
    console.log(file_id);
    const token = req.headers["x-access-token"];
    const decoded = verify(token, process.env.JWT_SECRET);
    const id = decoded.id;
    connection.query(
        "select * from user_files where id = ? and user_id = ?",
        [file_id, id],
        async (error, results) => {
            if (error) {
                console.log(error);
            }
            else {
                try {
                    fs.unlinkSync(results[0].path);
                  } catch(err) {
                    return res.json({
                        status: false,
                        message: "You do not own the file"
                    });
                  }
                }
            }
    );
    console.log(file_id, id);
    connection.query(
        "DELETE FROM user_files WHERE id = ? AND user_id = ?",
        [file_id, id],
        async (error, results) => {
            if (error) {
                console.log(error);
                res.json({
                    status: false,
                    message: "Error deleting file"
                });
            }
            else {
                res.json({
                    status: true,
                    message: "File deleted"
                });
            }
        }
    );
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