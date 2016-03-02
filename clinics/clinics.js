var qs = require('querystring');
var request = require('request');
var clinicBuilder = require('./clinicBuilder');

const SEARCH_END_POINT = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
const DETAILS_END_POINT = 'https://maps.googleapis.com/maps/api/place/details/json?';

function queryGooglePlacesDetails(url, location, callback){
    request({
            uri : url,
            method : 'GET'
        },
        function(error, response, body){
            if(!error && response.statusCode === 200){
                var returnedClinic = JSON.parse(body);
                if(returnedClinic.result){
                    clinicBuilder.convertToClinic(JSON.parse(body), location, function(err, clinic){
                        if(!err){
                            callback(null, clinic)
                        }
                        else{
                            callback({name : 'CONVERSION_ERROR'}, clinic)
                        }
                    });
                }
                else{
                    callback({name : 'CLINIC_NOT_FOUND'}, null);
                }
            }
            else {
                callback({name : 'REQUEST_ERROR'}, null);
            }
        });
}

function queryGooglePlacesSearch(url, location, callback){
    request({
            uri : url,
            method : 'GET'
        },
        function(error, response, body) {
            if(!error && response.statusCode === 200){
                clinicBuilder.convertToClinicList(JSON.parse(body), location, function(err, clinics){
                    if(!err){
                        callback(null, clinics);
                    }
                    else {
                        console.log('conversion error on clinics.js')
                        callback({name : 'CONVERSION_ERROR'}, clinics);
                    }
                });
            }
            else {
                console.log('request error on clinics.js');
                callback({name : 'REQUEST_ERROR'}, null);
            }
        });
}

exports.findById = function(parameters, callback){
    var parsedParameters = {
        key : parameters.key,
        placeid : parameters.id
    };

    var queryLocation = {
        latitude : parameters.latitude,
        longitude : parameters.longitude
    };

    queryGooglePlacesDetails(DETAILS_END_POINT + qs.stringify(parsedParameters), queryLocation, callback);
}

exports.search = function(parameters, callback){
    var parsedParameters = {
        key : parameters.key,
        location : parameters.latitude + ','+ parameters.longitude,
        radius : parameters.radius,
        type : 'hospital',
        name : 'Clinique'
    };

    var queryLocation = {
        latitude : parameters.latitude,
        longitude : parameters.longitude
    };

    queryGooglePlacesSearch(SEARCH_END_POINT + qs.stringify(parsedParameters), queryLocation, callback);
}