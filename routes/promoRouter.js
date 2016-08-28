// import the require modules
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

// import the schema
var Promotions = require('../models/promotions');

var promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')

// get all the promos
.get(function(req, res, next){
    Promotions.find(req.query, function(err, promo){
        if (err) next(err);
        res.json(promo);
    });
})

// add new promos
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Promotions.create(req.body, function(err, promo){
        if (err) next(err);
        console.log('Promo created!');

        var id = promo._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the promotion with id: ' + id);
    });
})

// delete all promos
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Promotions.remove({}, function(err, resp){
        if (err) next(err);
        res.json(resp);
    });
});

promoRouter.route('/:promoId')

// query a promo
.get(function(req, res, next){
    Promotions.findById(req.params.dishId, function(err, dish){
        if (err) next(err);
        res.json(dish);
    });
})

// update promotions
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Promotions.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {
        new: true
    }, function (err, dish){
        if (err) next(err);
        res.json(dish);
    });
})

// delete a particular promo
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    Promotions.findByIdAndRemove(req.params.dishId, function(err, resp){
        if (err) next(err);
        res.json(resp);
    });
});

module.exports = promoRouter;
