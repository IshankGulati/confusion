var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

// import the schema
var Dishes = require('../models/dishes');

var dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')

// query dishes
.get(function(req, res, next){
    Dishes.find(req.query)
    .populate('comments.postedBy')
    .exec(function(err, dish){
        if (err) next(err);
        res.json(dish);
    });
})

// add dishes
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Dishes.create(req.body, function(err, dish){
        if (err) throw next(err);
        console.log('Dish Created!');

        var id = dish._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the dish with id: ' + id);
    });
})

// deleting all the dishes
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Dishes.remove({}, function(err, resp){
        if (err) next(err);
        res.json(resp);
    });
});

dishRouter.route('/:dishId')

// get a particular dish
.get(function(req,res,next){
    Dishes.findById(req.params.dishId)
    .populate('comments.postedBy')
    .exec(function(err, dish){
        if (err) next(err);
        res.json(dish);
    });
})

// update a particular dish
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {
        new: true
    }, function(err, dish){
        if (err) next(err);
        res.json(dish);
    });
})

// delete a particular dish
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Dishes.findByIdAndRemove(req.params.dishId, function(err, resp){
        if (err) next(err);
        res.json(resp);
    });
});

// handling the comments
dishRouter.route('/:dishId/comments')

// get all the comments
.get(function (req, res, next) {
    Dishes.findById(req.params.dishId)
    .populate('comments.postedBy')
    .exec(function (err, dish) {
        if (err) next(err);
        res.json(dish.comments);
    });
})

// add new comment
.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) next(err);
        req.body.postedBy = req.decoded._id;
        dish.comments.push(req.body);
        dish.save(function (err, dish) {
            if (err) next(err);
            console.log('Updated Comments!');
            res.json(dish);
        });
    });
})

// delete all comments
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) next(err);
        for (var i = (dish.comments.length - 1); i >= 0; i--) {
            dish.comments.id(dish.comments[i]._id).remove();
        }
        dish.save(function (err, result) {
            if (err) next(err);
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all comments!');
        });
    });
});

// handling a particular id
dishRouter.route('/:dishId/comments/:commentId')

// get a particular comment
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Dishes.findById(req.params.dishId)
    .populate('comments.postedBy')
    .exec(function (err, dish) {
        if (err) next(err);
        res.json(dish.comments.id(req.params.commentId));
    });
})

// update a particular comment
.put(Verify.verifyOrdinaryUser, function (req, res, next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) throw err;
        dish.comments.id(req.params.commentId).remove();
        req.body.postedBy = req.decoded._id;
        dish.comments.push(req.body);
        dish.save(function (err, dish) {
            if (err) next(err);
            console.log('Updated Comments!');
            res.json(dish);
        });
    });
})

// delete a particular comment
.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        if(dish.comments.id(req.params.commentId).postedBy != req.decoded._id){
            var error = new Error('You are not authorised to perform this operation!');
            error.status = 403;
            return next(error);
        }
        dish.comments.id(req.params.commentId).remove();
        dish.save(function (err, resp) {
            if (err) next(err);
            res.json(resp);
        });
    });
});

module.exports = dishRouter;
