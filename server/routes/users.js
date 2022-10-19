const express = require("express");
const router = express.Router();
const { users } = require("../models");

router.post("/", async (req, res) => {
    const user = await users.create(req.body)
    .then()
    .catch((err) => {
        res.json(err);
    });
    res.json(user);
});

module.exports = router;