const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// model:
const User = require("../models/User");

// SIGN UP : 
router.post("/user/signup", async (req, res) => {
    const { email, password, description, username } = req.fields;
    try {
        if (email && password && description && username) {
            const emailAlreadyUsed = await User.findOne({ email: email });
            const usernameAlreadyUsed = await User.findOne({ username: username });
            if (!usernameAlreadyUsed) {
                if (!emailAlreadyUsed) {
                    const token = uid2(16);
                    const salt = uid2(16);
                    const hash = SHA256(password + salt).toString(encBase64);
                    const newUser = new User({
                        email,
                        description,
                        username,
                        token,
                        salt,
                        hash,
                    });
                    await newUser.save();
                    res.json({
                        _id: newUser._id,
                        email: email,
                        description: description,
                        username: username,
                        token: token,
                        salt: salt,
                    });
                } else {
                    res.status(400).json({ message: "Cet email est déjà utilisé" });
                }
            } else {
                res.status(400).json({ message: "Ce username est déjà utilisé" });
            }
        } else {
            res.status(400).json({ message: "Missing parameters" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// LOGIN : 
router.post("/user/login", async (req, res) => {
    try {
        if (req.fields.email === undefined) {
            console.log("here")
            res.status(400).json({ message: "email is not defined" })
        } else {
            if (req.fields.password === undefined) {
                res.status(400).json({ message: "password is not defined" })
            } else {
                const checkUser = await User.findOne({ email: email });
                if (checkUser === null) { //   et non undefined !!!
                    res.status(401).json({ message: "User not found !" })
                } else {
                    console.log("hello from check")
                    //res.json("hello")
                    const newHash = SHA256(req.fields.password + checkUser.salt).toString(encBase64);
                    if (checkUser.hash === newHash) {
                        res.json({
                            _id: checkUser._id,
                            token: checkUser.token,
                        })
                    } else {
                        res.json({ error: "hash is not matching" })
                    }
                }
            }
        }
    } catch (error) {
        res.status(400).json(error.message)
    }

});

module.exports = router;