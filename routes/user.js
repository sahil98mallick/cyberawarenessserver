const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../model/user');


// Register New user
router.post('/userregister', (req, res, next) => {
    // Check if the email already exists in the database
    Users.findOne({ email: req.body.email })
        .exec()
        .then(existingUser => {
            if (existingUser) {
                return res.status(409).json({
                    status: 409,
                    message: "Email already exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            status: 500,
                            details: err.message,
                            error: err
                        });
                    } else {
                        const useralldata = new Users({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                            phone: req.body.phone,
                            activestatus: req.body.activestatus,
                            createdAt: new Date(),
                            address: req.body.address
                        });

                        useralldata.save()
                            .then(result => {
                                res.status(200).json({
                                    success: true,
                                    status: 200,
                                    message: "Registration Completed",
                                    usersdata: result
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    status: 500,
                                    message: "Registration Not Completed",
                                    error: err
                                });
                            });
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: "Registration Process Failed",
                error: err
            });
        });
});
// Login API
router.post('/login', (req, res, next) => {
    Users.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(200).json({
                    message: "User not found"
                });
            }

            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (!result) {
                    return res.status(200).json({
                        message: "Invalid password. Please try again."
                    });
                }

                if (result) {
                    const token = jwt.sign(
                        {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            password: user.password,
                            phone: user.phone,
                            activestatus: user.activestatus,
                            address: user.address,
                            createdAt: user.createdAt
                        },
                        'logintoken',
                        {
                            expiresIn: "24h"
                        }
                    );

                    res.status(200).json({
                        status: 200,
                        success: true,
                        message: "Login Successfully",
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            password: user.password,
                            phone: user.phone,
                            activestatus: user.activestatus,
                            address: user.address,
                            createdAt: user.createdAt
                        },
                        token: token
                    });
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Login Failed. Please try again later.",
                error: err
            });
        });
});

// Single user Details
router.get('/singleuser/:id', ((req, res, next) => {
    Users.findById(req.params.id)
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "Data Found Successfully",
                    status: true,
                    finddata: result
                })
            } else {
                res.status(500).json({
                    message: "No Data Found"
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Data Not Found",
                status: false,
                error: err
            })
        })
}))

router.put('/updateuserdetail/:id', (req, res, next) => {
    const updateUserData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        userType: req.body.userType,
        activestatus: req.body.activestatus,
        address: req.body.address
    };
    if (req.body.password) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    error: err
                });
            }
            updateUserData.password = hash;
            updateUser();
        });
    } else {
        updateUser();
    }

    function updateUser() {
        Users.findByIdAndUpdate(req.params.id, updateUserData, { new: true })
            .then(updatedUser => {
                if (!updatedUser) {
                    return res.status(404).json({
                        status: false,
                        message: "User not found"
                    });
                }
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "User Updated Successfully",
                    updateduser: updatedUser
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err,
                    status: false,
                    message: "Failed to update User details."
                });
            });
    }
});

router.put('/changepasswordfromaccount', (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    // Find the user by email
    Users.findOne({ email: email })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "User not found"
                });
            }

            // Compare the current password with the stored hashed password
            bcrypt.compare(currentPassword, user.password, (err, result) => {
                if (!result) {
                    return res.status(401).json({
                        status: false,
                        message: "Current password is incorrect"
                    });
                }

                // Hash the new password
                bcrypt.hash(newPassword, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            error: err,
                            message: "Failed to hash the new password"
                        });
                    }
                    Users.findByIdAndUpdate(
                        user._id,
                        { password: hash },
                        { new: true }
                    )
                        .then(updatedUser => {
                            res.status(200).json({
                                status: true,
                                message: "Password changed successfully",
                                updateduser: updatedUser
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                status: false,
                                error: err,
                                message: "Failed to update password"
                            });
                        });
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: false,
                error: err,
                message: "Failed to find user by email"
            });
        });
});

// Reset Password
router.put('/resetpassword', (req, res) => {
    const { email, phone, newPassword } = req.body;
    if (!email || !phone || !newPassword) {
        return res.status(400).json({
            status: 400,
            message: "Please provide email, phone, and new password",
        });
    }

    // Find the user by email and phone
    Users.findOne({ email, phone })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(200).json({
                    status: 200,
                    message: "User not found",
                });
            }

            bcrypt.hash(newPassword, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        status: 500,
                        error: err,
                        message: "Failed to hash the new password",
                    });
                }

                Users.findByIdAndUpdate(
                    user._id,
                    { password: hash },
                    { new: true }
                )
                    .then(updatedUser => {
                        if (!updatedUser) {
                            return res.status(500).json({
                                status: 500,
                                message: "Failed to update the password",
                            });
                        }

                        res.status(200).json({
                            status: 200,
                            success: true,
                            message: "Password Changed Successfully",
                            updateduser: {
                                _id: updatedUser._id,
                                name: updatedUser.name,
                                email: updatedUser.email,
                                phone: updatedUser.phone,
                                activestatus: updatedUser.activestatus,
                                password: updatedUser.password,
                                address: updatedUser.address,
                            },
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            status: 500,
                            error: err,
                            message: "Failed to update the password",
                        });
                    });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 500,
                error: err,
                message: "Failed to find the user",
            });
        });
});


module.exports = router;