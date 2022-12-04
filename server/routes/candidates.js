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
      const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniquePrefix + '-' + file.originalname)
    }
})

var upload = multer({ storage: storage })

router.get("/getCandidates", validateToken, (req, res) => {
    connection.query(
        "SELECT * FROM candidatecv",
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

router.get("/getCandidateProfile/:id", validateToken, (req, res) => {
    connection.query(
        "SELECT * FROM candidatecv WHERE id = ?",
        [req.params.id],
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

router.get("/getCandidateEducation/:id", validateToken, (req, res) => {
    connection.query(
        "SELECT candidatecv_education.institute, candidatecv_education.degree_type, DATE_FORMAT(starting_date, '%m-%d-%Y') as 'starting_date', DATE_FORMAT(ending_date, '%m-%d-%Y') as 'ending_date' FROM candidatecv_education WHERE candidatecv_id = ?",
        [req.params.id],
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
                    data: results,
                });
            }
        }
    );
});

router.get("/getCandidateExperience/:id", validateToken, (req, res) => {
    connection.query(
        "SELECT * FROM candidatecv_job_history WHERE candidatecv_id = ?",
        [req.params.id],
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

router.get("/getAllSkills", validateToken, (req, res) => {
    connection.query(
        "SELECT * FROM skills",
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
                

router.post("/addSkill", validateToken, (req, res) => {
    connection.query(
        "INSERT INTO candidatecv_skill (candidatecv_id, skill_id) VALUES (?, ?)",
        [req.body.candidatecv_id, req.body.skill_id],
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
                    message: "Skill added successfully",
                });
            }
        }
    );
});

router.get("/getCandidateSkills/:id", validateToken, (req, res) => {
    connection.query(
        "SELECT skills.name FROM candidatecv_skill, skills WHERE candidatecv_id = ? AND candidatecv_skill.skill_id = skills.id",
        [req.params.id],
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
                    data: results,
                });
            }
        }
    );
});

router.post("/addCandidateExperience", validateToken, (req, res) => {
    const { candidatecv_id, company_name, designation, starting_date, ending_date } = req.body;
    connection.query(
        "INSERT INTO candidatecv_job_history (candidatecv_id, company_name, designation, starting_date, ending_date) VALUES (?, ?, ?, ?, ?)",
        [candidatecv_id, company_name, designation, starting_date, ending_date],
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
                    message: "Experience added successfully",
                });
            }
        }
    );
});

router.post("/addCandidateEducation", validateToken, (req, res) => {
    connection.query(
        "INSERT INTO candidatecv_education (candidatecv_id, institute, degree_type, starting_date, ending_date) VALUES (?, ?, ?, ?, ?)",
        [req.body.candidatecv_id, req.body.institute, req.body.degree_type, req.body.starting_date, req.body.ending_date],
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
                    message: "Education added successfully",
                });
            }
        }
    );
});     


router.post("/uploadPhoto", upload.single('file'), (req, res) => {
    res.json({
        status: true,
        message: "File uploaded successfully",
    });
});

router.post("/updateCandidate", validateToken, (req, res) => {
    const { first_name, last_name, email, phone, location, mother_language, job_type, description, source } = req.body;
    connection.query(
        "UPDATE candidatecv SET first_name = ?, last_name = ?, email = ?, phone = ?, location = ?, mother_language = ?, job_type = ?, description = ?, source = ? WHERE id = ?",
        [first_name, last_name, email, phone, location, mother_language, job_type, description, source, req.body.id],
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
                    message: "Candidate updated successfully",
                });
            }
        }
    );
});

router.post("/addCandidate", validateToken, upload.single('file'), (req, res) => {
    var photo=null;
    if(req.file) photo=req.file.path;
    const { first_name, last_name, email, phone, location, mother_language, job_type, description, source } = req.body;
    connection.query(
        "INSERT INTO candidatecv (photo, first_name, last_name, email, phone, location, mother_language, job_type, description, source, uuid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [photo, first_name, last_name, email, phone, location, mother_language, job_type, description, source, uuid='1234'],
        (error, results) => {
            if (error) {
                res.json({
                    status: false,
                    message: "Error occured",
                });
                return;
            }
            else {
                res.json({
                    status: true,
                    message: "Candidate added successfully",
                });
                return;
            }
        }
    );
});

router.post("/deleteCandidate", validateToken, (req, res) => {
    const deleteID = req.body.id;
    //transaction to delete education, files, job history, language, pr, skill, tag, candidatecv
    connection.beginTransaction(function (err) {
        if (err) { throw err; }
        connection.query(
            "DELETE FROM candidatecv_education WHERE candidatecv_id in ?",
            [[deleteID]],
            (error, results) => {
                if (error) {
                    connection.rollback(function () {
                        throw error;
                    });
                }
                else {
                    connection.query(
                        "DELETE FROM candidatecv_files WHERE candidatecv_id in ?",
                        [[deleteID]],
                        (error, results) => {
                            if (error) {
                                connection.rollback(function () {
                                    throw error;
                                });
                            }
                            else {
                                connection.query(
                                    "DELETE FROM candidatecv_job_history WHERE candidatecv_id in ?",
                                    [[deleteID]],
                                    (error, results) => {
                                        if (error) {
                                            connection.rollback(function () {
                                                throw error;
                                            });
                                        }
                                        else {
                                            connection.query(
                                                "DELETE FROM candidatecv_language WHERE candidatecv_id in ?",
                                                [[deleteID]],
                                                (error, results) => {
                                                    if (error) {
                                                        connection.rollback(function () {
                                                            throw error;
                                                        });
                                                    }
                                                    else {
                                                        connection.query(
                                                            "DELETE FROM candidatecv_pr WHERE candidate_ID in ?",
                                                            [[deleteID]],
                                                            (error, results) => {
                                                                if (error) {
                                                                    connection.rollback(function () {
                                                                        throw error;
                                                                    });
                                                                }
                                                                else {
                                                                    connection.query(
                                                                        "DELETE FROM candidatecv_skill WHERE candidatecv_id in ?",
                                                                        [[deleteID]],
                                                                        (error, results) => {
                                                                            if (error) {
                                                                                connection.rollback(function () {
                                                                                    throw error;
                                                                                });
                                                                            }
                                                                            else {
                                                                                connection.query(
                                                                                    "DELETE FROM candidatecv_tag WHERE candidatecv_id in ?",
                                                                                    [[deleteID]],
                                                                                    (error, results) => {
                                                                                        if (error) {
                                                                                            connection.rollback(function () {
                                                                                                throw error;
                                                                                            });
                                                                                        }
                                                                                        else {
                                                                                            connection.query(
                                                                                                "DELETE FROM candidatecv WHERE id in ?",
                                                                                                [[deleteID]],
                                                                                                (error, results) => {
                                                                                                    if (error) {
                                                                                                        connection.rollback(function () {
                                                                                                            throw error;
                                                                                                        });
                                                                                                    }
                                                                                                    else {
                                                                                                        connection.commit(function (err) {
                                                                                                            if (err) {
                                                                                                                connection.rollback(function () {
                                                                                                                    throw err;
                                                                                                                });
                                                                                                            }
                                                                                                            res.json({
                                                                                                                status: true,
                                                                                                                message: "Candidate deleted successfully",
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
                                                                }
                                                            }
                                                        );
                                                    }
                                                }
                                            );
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

module.exports = router;