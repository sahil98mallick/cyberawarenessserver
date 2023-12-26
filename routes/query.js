const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const QueryDetails = require('../model/query');

// Add Query
router.post('/addquerydetails', (req, res, next) => {
    const queryData = new QueryDetails({
        _id: new mongoose.Types.ObjectId(),
        creatorname: req.body.creatorname,
        creatorid: req.body.creatorid,
        querydetails: req.body.querydetails,
        status: req.body.status,
        createdAt: new Date(),
    });

    queryData.save()
        .then(result => {
            res.status(200).json({
                success: true,
                status: 200,
                message: "Query Added Successfully",
                queryData: result
            });
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: "Query details not added",
                error: err
            });
        });
});

// View Query by UserID
router.get('/viewquerybyuserid/:creatorid', (req, res, next) => {
    const creatorId = req.params.creatorid;

    QueryDetails.find({ creatorid: creatorId })
        .exec()
        .then(queryDetails => {
            if (queryDetails.length > 0) {
                res.status(200).json({
                    success: true,
                    status: 200,
                    message: "Query Details Found",
                    queryDetails: queryDetails
                });
            } else {
                res.status(200).json({
                    success: true,
                    status: 200,
                    message: "No Query Details found for the given creatorid",
                    queryDetails: []
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: "Error fetching Query Details",
                error: err
            });
        });
});

// Delete Query by CreatorID
router.delete('/deletequerybyid/:id', (req, res) => {
    QueryDetails.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result.deletedCount > 0) {
                // console.log(result);
                res.status(200).json({
                    success: true,
                    message: "Deleted successfully",
                    deletedata: result
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "No data found",
                    deletedata: []
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Failed to delete data",
                error: err
            });
        });
});
module.exports = router;
