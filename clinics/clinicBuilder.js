var _ = require('underscore');
var distanceCalculator = require('./distanceCalculator');

exports.convertToClinicList = function(body, location, callback){
    var clinics = [];
    _.each(body.results, function(result){
        var clinicLocation = result.geometry.location;
        var distance = distanceCalculator.calculateDistance(location.latitude, location.longitude, clinicLocation.lat, clinicLocation.lng);
        clinics.push({
            id : result.place_id,
            name : result.name,
            vicinity : result.vicinity,
            distance : distance,
            location : clinicLocation,
            waitings : 0
        });
    });
    return callback( null, { "clinics" : clinics } );
}

exports.convertToClinic = function(body, location, callback){
    var result = body.result;
    var clinic = {
        id : result.place_id,
        name : result.name,
        address : result.formatted_address,
        phone_number : result.formatted_phone_number,
        location : result.geometry.location,
        waitings : 0
    };
    if(location.latitude && location.longitude){
        var clinicLocation = result.geometry.location;
        clinic['distance'] = distanceCalculator.calculateDistance(location.latitude, location.longitude, clinicLocation.lat, clinicLocation.lng);
    }
    return callback(null, clinic);
}