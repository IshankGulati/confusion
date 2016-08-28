// import the required modules
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

// import the schema
var Leadership = require('../models/leadership');

var leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')

// query leaders
.get(function(req, res, next){
    Leadership.find(req.query, function(err, leader){
        if (err) next(err);
        res.json(leader);
    });
})

// add leaders
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Leadership.create(req.body, function(err, leader){
        if (err) next(err);
        console.log('Leader Created!');

        var id = leader._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the leader with id: ' + id);
    });
})

// deleting all the leaders
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Leadership.remove({}, function(err, resp){
        if (err) next(err);
        res.json(resp);
    });
});

leaderRouter.route('/:leaderId')

// get a particular leader
.get(function(req, res, next){
    Leadership.findById(req.params.leaderId, function(err, leader){
        if (err) next(err);
        res.json(leader);
    });
})

// update a particular leader
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Leadership.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, {
        new: true
    }, function(err, leader){
        if (err) next(err);
        res.json(leader);
    });
})

// delete a particular leader
.delete(verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Leadership.findByIdAndRemove(req.params.leaderId, function(err, resp){
        if (err) next(err);
        res.json(resp);
    });
});

module.exports = leaderRouter;
