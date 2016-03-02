var places = require('../clinics/clinics');
var config = require('../config/config');

const DEFAULT_SEARCH_DISTANCE = 3000;

exports.search = function (req, res){
    places.search({
        key : config.GOOGLE_PLACES_API_KEY,
        latitude : req.query.latitude,
        longitude : req.query.longitude,
        radius : req.query.radius || DEFAULT_SEARCH_DISTANCE,
        type : 'hospital',
        name : 'Clinique'
    }, function(err, clinics){
        if(!err){
            res.status(200).send(clinics);
        }
        else{
            if(err.name === 'REQUEST_ERROR'){
                res.status(400).send({
                    errorCode: 'BAD_REQUEST',
                    message: 'please verify your request body'
                });
            }
            else {
                res.status(500).send({
                    errorCode: 'INTERNAL_ERROR',
                    message: 'please try again or contact the admin if problem persists'
                });
            }
        }
    });
};

exports.findById = function (req, res){
    places.findById({
        key : config.GOOGLE_PLACES_API_KEY,
        id : req.params.id,
        latitude : req.query.latitude,
        longitude : req.query.longitude,
    }, function(err, clinic){
        if(!err){
            res.status(200).send(clinic);
        }
        else{
            if(err.name === 'REQUEST_ERROR'){
                res.status(400).send({
                    errorCode: 'BAD_REQUEST',
                    message: 'please verify your request body'
                });
            }
            else {
                res.status(500).send({
                    errorCode: 'INTERNAL_ERROR',
                    message: 'please try again or contact the admin if problem persists'
                });
            }
        }
    });
};