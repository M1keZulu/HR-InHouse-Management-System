const express = require("express");
const router = express.Router();
const { users } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

const {sign} = require('jsonwebtoken');

router.post("/", validateToken, async (req, res) => {
    console.log(req.body);
    const user = await users.create(req.body.formData)
    .then()
    .catch((err) => {
        res.status(400).json({auth: true, error: err});
    });
    res.json(user);
});

router.post("/deleteUsers", validateToken, async (req, res) => {
    console.log(req.body);
    const user = await users.destroy({
        where: {
            id: req.body.id
        }
    })
    .then()
    .catch((err) => {
        res.status(400).json({auth: true, error: "Error deleting user"});
    });
    res.json(user);
});

router.get("/getUsers", validateToken, async (req, res) => {
    const user = await users.findAll();
    res.json(user);
});

router.post("/updateUser", validateToken, async (req, res) => {
    console.log(req.body);
    const user = await users.update(req.body.modalData, {
        where: {
            id: req.body.modalData.id
        }
    })
    .then()
    .catch((err) => {
        res.status(400).json({auth: true, error: "Error updating user"});
    });
    res.json(user);
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const user = await users.findOne({where: {email: email}});
    if (!user) {
        res.json({auth: false, error: "User doesn't exist"});
    } else {
        if (password == user.password) {
            const token = sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "1h"});
            res.json({auth: true, token: token});
        } else {
            res.status(401).json({auth: false, error: 'Wrong password'});
        }
    }
});

module.exports = router;