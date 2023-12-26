const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const ContactDetails = require('../model/contact');

// Add Query
router.post('/addcontactdetails', (req, res, next) => {
    const queryData = new ContactDetails({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message,
        createdAt: new Date(),
    });

    queryData.save()
        .then(result => {
            res.status(200).json({
                success: true,
                status: 200,
                message: "Your Message Added Successfully... Our Executive will call you Soon",
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: "Message details not added",
                error: err
            });
        });
});

// View All Jobs
router.get('/allcontactdetails', ((req, res, next) => {
    ContactDetails.find()
        .then(result => {
            if (result && result.length > 0) {
                // console.log(result);
                res.status(200).json({
                    success: true,
                    totalcount: result.length,
                    message: "Data Received successfully",
                    data: result
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "No data found",
                    data: []
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Data Not retrieved Properly",
                error: err
            })
        })
}))

module.exports = router;