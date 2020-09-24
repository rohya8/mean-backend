const express = require("express");
const User = require("../models/user");
const router = express.Router();
const brcypt = require("bcrypt");

router.post("/signup", (req, res, next) => {
    brcypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const userObj = new User({
                email: req.body.email,
                password: hash,
            });
            userObj
                .save()
                .then((result) => {
                    res.status(200).json({
                        message: "User Created!",
                        result: result,
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        error: err,
                    });
                });
        })
        .catch((err) => { });
});

module.exports = router;
