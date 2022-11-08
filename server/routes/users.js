const express = require("express");
const router = express.Router();
const { users } = require("../models");

const {sign} = require('jsonwebtoken');

router.post("/", async (req, res) => {
    const user = await users.create(req.body)
    .then()
    .catch((err) => {
        res.json(err);
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
            const token = sign({id: user.id}, "secretkey", {expiresIn: "1h"});
            res.json({auth: true, token: token});
        } else {
            res.json({auth: false, error: "Wrong password"});
        }
    }
});

module.exports = router;