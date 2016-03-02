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
                    clinicBuilder.convertToClinic(returnedClinic, location, function(conversionError, clinic){
                        if(conversionError){
                            console.error('conversion error on clinics.js details');
                            return callback({name : 'CONVERSION_ERROR'});
                        }
                        else{
                            return callback(null, clinic);
                        }
                    });
                }
                else{
                    return callback({name : 'CLINIC_NOT_FOUND'});
                }
            }
            else{
                console.error('request error on clinics.js details');
                return callback({name : 'REQUEST_ERROR'});
            }
        });
}

function queryGooglePlacesSearch(url, location, callback){
    request({
            uri : url,
            method : 'GET'
        },
        function(error, response, body){
            if(!error && response.statusCode === 200){
                clinicBuilder.convertToClinicList(JSON.parse(body), location, function(conversionError, clinics){
                    if(conversionError){
                        console.error('conversion error on clinics.js search');
                        return callback({name : 'CONVERSION_ERROR'});
                    }
                    else{
                        return callback(null, clinics);
                    }
                });
            }
            else{
                console.error('request error on clinics.js search');
                return callback({name : 'REQUEST_ERROR'});
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