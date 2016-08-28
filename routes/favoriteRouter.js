// importing the required modules
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

// schema for router
var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')

// apply ordinary verification to all the requests
.all(Verify.verifyOrdinaryUser)

// query all the favorites
.get(function(req, res, next){
    Favorites.findOne({postedBy: req.decoded._id})
    .populate('postedBy')
    .populate('dishes')
    .exec(function(err, fav){
        if (err) next(err);
        res.json(fav);
    });
})

// adds a new dish to favorite if the document already exists
// else creates and returns a new one
.post(function(req, res, next){
    Favorites.findOneAndUpdate(
        {postedBy: req.decoded._id},
        {$setOnInsert: {"postedBy": req.decoded._id},
        $push: {"dishes": req.body._id}},
        {upsert: true, returnNewDocument: true, new: true},
        function(err, fav) {
            if (err) next(err);
            res.json(fav);
        }
    );
})

.delete(function(req, res, next){
    Favorites.remove(
        {postedBy: req.decoded._id},
        function(err, fav){
            if (err) next(err);
            res.json(fav);
        }
    );
});

favoriteRouter.route('/:dishObjectId')

// apply ordinary verification to all the requests
.all(Verify.verifyOrdinaryUser)

// delete a particular favorite dish
.delete(function(req, res, next){
    Favorites.findOneAndUpdate(
        {postedBy: req.decoded._id},
        {$pull: {"dishes": req.params.dishObjectId}},
        {returnNewDocument: true, new: true},
        function(err, fav){
            if (err) next(err);
            res.json(fav);
        }
    );
});

module.exports = favoriteRouter;
