const User = require("../models/user");
const brcypt = require("bcryptjs");
const CONSTANT = require("../CONSTANT.json");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
    brcypt.hash(req.body.password, 10)
        .then((hash) => {
            let userObj = new User({
                email: req.body.email,
                password: hash,
            });
            userObj
                .save()
                .then((result) => {
                    console.log(`Signup : ${req.body.email}`);
                    res.status(200).json({
                        message: "User Created!",
                        result: result,
                    });
                })
                .catch((err) => {
                    console.log(err)
                    res.status(500).json({
                        message: CONSTANT.invalid_credentials,
                    });
                });
        });
};

exports.userLogin = (req, res, next) => {
    let userDetails;
    console.log(`Login : ${req.body.email}`);
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                throw new Error('Auth failed');
            }
            userDetails = user;
            return brcypt.compare(req.body.password, user.password);
        })
        .then((result) => {
            if (!result) {
                return res.status(400).json({
                    message: CONSTANT.erroMsg,
                });
            }
            const token = jwt.sign(
                {
                    email: userDetails.email,
                    userId: userDetails._id,
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "1h" }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: userDetails._id
            });
        })
        .catch((err) => {
            res.status(400).json({
                message: CONSTANT.erroMsg,
            });
        });
};

process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at ', p);
    })
    .on('uncaughtException', err => {
        console.error('Uncaught Exception thrown', err);
    });
