const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const colores = require("colors");

const User = require("../models/user");
const verifyToken = require('../middlewares/verifyToken')


router.get("/getUsers", verifyToken, (req, res) => {
    try {
        User.find({}, "name email img role", (err, user) => {
            if (err) {
                return res.status(400).json({
                    ok: "false",
                    message: "This user does not exist",
                });
            }
            return res.status(200).json({
                ok: "true",
                users: user,
            });
        });
    } catch (err) {
        console.log("AN ERROR OCCURRED IN OBTAINING USERSS".red, err);
        return res.status(500).json({
            ok: "false",
            message: "An unexpected error occurred while getting users",
        });
    }
});

router.post("/createUser", verifyToken, async (req, res) => {
    try {
        const {name,email,password,img,role} = await req.body;
        const usuario = await new User({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            img,
            role
        });

        const userSave = await usuario.save();

        console.log("token".green, req.tokenPayLoad)

        res.status(201).json({
            ok: "true",
            user: userSave,
            tokenPayLoad: req.tokenPayLoad
        });
    } catch (err) {
        console.log("AN ERROR HAPPENED WHEN CREATING THE USER".red, err);
        if (err.errors.email) {
            return res.status(400).json({
                ok: "false",
                message: err.errors.email.properties.message,
            });
        } else if (err.errors.role) {
            return res.status(400).json({
                ok: "false",
                message: err.errors.role.properties.message,
            });
        } else {
            return res.status(500).json({
                ok: "false",
                message: "an unexpected error occurred while creating the user",
            });
        }
    }
});

router.put("/editUser/:id", verifyToken,async (req, res) => {
    try {
        const id = await req.params.id;
        const {name,email,role} = await req.body;
        User.findByIdAndUpdate(
            id,
            {
                name,
                email,
                role
            },
            (err, userUpdated) => {
                if (err) {
                    throw err
                } else {
                    if (userUpdated) {
                        return res.status(200).json({
                            ok: "true",
                            user: userUpdated,
                        });

                    }
                    return res.status(400).json({
                        ok: "false",
                        message: "This user does not exist",
                    });
                }
            }
        );
    } catch (err) {
        console.log("AN UNEXPECTED ERROR HAPPENED WHEN EDITING THE USER".red, err);
        return res.status(500).json({
            ok: "false",
            message: "AN UNEXPECTED ERROR HAPPENED WHEN EDITING THE USER",
        });
    }
});

router.delete("/deleteUser/:id", verifyToken, async (req, res) => {
    try {
        const id = await req.params.id;

        User.findByIdAndRemove(id, (err, removedUser) => {
            if (err) {
                throw err
            } else {
                if (removedUser) {
                    return res.status(200).json({
                        ok: "true",
                        message: removedUser,
                    });
                }
                return res.status(400).json({
                    ok: "false",
                    message: "This user does not exist",
                });
            }
        });
    } catch (err) {
        console.log("AN UNEXPECTED ERROR HAPPENED WHEN DELETING THE USER".red, err);
        return res.status(500).json({
            ok: "false",
            message: "AN UNEXPECTED ERROR HAPPENED WHEN DELETING THE USER",
        });
    }
});


module.exports = router;
