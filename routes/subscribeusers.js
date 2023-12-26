const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const Subscribeusers = require('../model/subscribeusers');

router.post('/subscribe', (req, res, next) => {
    const queryData = new Subscribeusers({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        createdAt: new Date(),
    });

    queryData.save()
        .then(result => {
            res.status(200).json({
                success: true,
                status: 200,
                message: "You Subscribed..Thank You",
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

module.exports = router;