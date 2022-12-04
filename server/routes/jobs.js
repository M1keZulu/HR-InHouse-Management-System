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

router.post("/addJob", validateToken, (req, res) => {
    const { title, description, extra_requirements, salary, company_id, skills } = req.body;
    connection.beginTransaction(function(err) {
        if (err) { throw err; }
        connection.query('INSERT INTO jobs (title, description, extra_requirements, salary, company_id) VALUES (?, ?, ?, ?, ?)', [title, description, extra_requirements, salary, company_id], function (error, results, fields) {
            if (error) {
                return connection.rollback(function() {
                    throw error;
                });
            }
            let job_id = results.insertId;
            let values = [];
            for (let i = 0; i < skills.length; i++) {
                values.push([job_id, skills[i]]);
            }
            connection.query('INSERT INTO job_skill (job_id, skill_id) VALUES ?', [values], function (error, results, fields) {
                if (error) {
                    return connection.rollback(function() {
                        throw error;
                    });
                }
                connection.commit(function(err) {
                    if (err) {
                        return connection.rollback(function() {
                            throw err;
                        });
                    }
                    return res.json({
                        status: true,
                        message: "Job added successfully",
                    });
                });
            });
        });
    })
});

router.get("/getJobs", validateToken, (req, res) => {
    //query with join on company table
    connection.query(
        "SELECT jobs.id, jobs.title, jobs.description, jobs.extra_requirements, jobs.salary, jobs.company_id, companies.name as 'company_name', actions.name as 'status' from companies, jobs, actions where companies.id = jobs.company_id and actions.id=jobs.status",
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

router.get("/getJob/:id", validateToken, (req, res) => {
    const { id } = req.params;
    connection.query(
        "SELECT jobs.id, jobs.title, jobs.description, jobs.extra_requirements, jobs.salary, jobs.company_id, companies.name as 'company_name', actions.name as 'status' from companies, jobs, actions where companies.id = jobs.company_id and actions.id=jobs.status and jobs.id = ?",
        [id],
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

router.get("/getSkillCandidates/:id", validateToken, (req, res) => {
    const { id } = req.params;
    connection.query(
        "SELECT candidatecv.id, candidatecv.first_name, candidatecv.last_name, candidatecv.gender, candidatecv.dob, candidatecv.email, candidatecv.phone from candidatecv where candidatecv.id in (select candidatecv_skill.candidatecv_id from candidatecv_skill where skill_id in (select skill_id from job_skill where job_id = ?))",
        [id],
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


router.get('/getJobSkills/:id', validateToken, (req, res) => {
    const { id } = req.params;
    connection.query(
        "SELECT skills.id, skills.name from skills, job_skill where skills.id = job_skill.skill_id and job_skill.job_id = ?",
        [id],
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

router.get('/getInProcessCandidates/:id', validateToken, (req, res) => {
    const { id } = req.params;
    connection.query(
        "SELECT candidatecv.id, candidatecv.first_name, candidatecv.last_name, candidatecv.gender, candidatecv.dob, candidatecv.email, candidatecv.phone, job_candidate.id as 'link_id', job_candidate.status as 'job_status' from candidatecv, job_candidate where candidatecv.id = job_candidate.candidatecv_id and job_candidate.job_id = ?", 
        [id],
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

router.post('/updateStatus', validateToken, (req, res) => {
    const { id, status } = req.body;
    connection.query(
        "UPDATE job_candidate SET status = ? WHERE id = ?", 
        [status, id],
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
                    message: "Status updated successfully",
                });
            }
        }
    );
});

router.post('/startProcess', validateToken, (req, res) => {
    const { job_id, candidate_id } = req.body;
    connection.query(
        "INSERT INTO job_candidate (job_id, candidatecv_id, status) VALUES (?, ?, 'Processed')",
        [job_id, candidate_id],
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
                    message: "Process started successfully",
                });
            }
        }
    );
});

router.get('/getCandidatesNotInProcess/:id', validateToken, (req, res) => {
    const { id } = req.params;
    connection.query(
        "select * from candidatecv where id not in (select candidatecv_id from job_candidate where job_id = ?)",
        [id],
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

module.exports = router;