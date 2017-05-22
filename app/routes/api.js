// Required Modules
var express = require('express');
var router = express.Router();
var Bing = require('node-bing-api')({ accKey: 'f654ff2ada854bf99cdc99761619f2ee' });
var util = require('util');
var moment = require('moment');
var Image = require('../models/image');

router.get('/:term', function(req, res, next) {
    
    // Create new objects to store Bing Data
    function image(url, snippet, thumbnail, context) {
        this.url = url;
        this.snippet = snippet;
        this.thumbnail = thumbnail;
        this.context = context;
    } 
    
    var arr = [];
    var offset = req.query.offset || 10;
    
    // Save searches to DB & do it before hitting Bing API
    var newImage = new Image({
        term: req.params.term,
        when: moment().format('MMMM Do, YYYY, h:mm a')
    });
    Image.saveImage(newImage, function(err, docs) {
        if (err) throw err;
    });
    
    // Bing Image Search API
    Bing.images(req.params.term, {
        top: offset
        }, function(err, results, body) {
            if (err) throw err;
            if (offset <= 50) {
                for (var x = 0; x < offset; x++) {
                    arr.push(new image(
                        body.value[x].webSearchUrl, 
                        body.value[x].name,
                        body.value[x].thumbnailUrl, 
                        body.value[x].hostPageDisplayUrl));
                }
                res.json(arr);
            } else {
                res.send('You can view up to 50 image results and no more');
            }
    });
});

// View searches that are stored in DB
router.get('/view/history', function(req, res, next) {
    
    var arr = [];
    function terms(term, when) {
        this.term = term;
        this.when = when;
    }
    
    Image.findAll({}, function(err, docs) {
        if (err) throw err;
        if (!docs.length) {
            res.send('There is no search history available');
        } else {
            docs.forEach(function(item) {
                arr.push(new terms(item.term, item.when));
            });
            res.json(arr.reverse());
        }
    });
});

module.exports = router; 
