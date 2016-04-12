var users = require("../users/users").model;
var places = require("../clinics/clinics");
var config = require("../config/config");

function populateUserInformation(waiting, callback){
    users.findById(waiting.user.id, function(err, user){
       if(!err){
           if(user){
               waiting.user.name = user.name;
               callback(null, waiting);
           }
           else{
               callback({name : 'USER_NOT_FOUND'}, waiting);
           }
       }
       else{
           callback(err, waiting);
       } 
    });
}

function populateClinicInformation(waiting, callback){
    places.findById({
        key : config.GOOGLE_PLACES_API_KEY,
        id : waiting.clinic.id
    }, function(err, clinic){
        if(!err){
            waiting.clinic.name = clinic.name;
            waiting.clinic.address = clinic.address;
            waiting.clinic.phone_number = clinic.phone_number;
            waiting.clinic.location = clinic.location;
            waiting.clinic.waitings = clinic.waitings;
            
            callback(null, waiting);
        }
        else{
            callback(err, waiting);
        }
    });
}

exports.populateWaiting = function(waiting, callback){
    
    if(waiting.clinic.id && waiting.user.id){
        populateUserInformation(waiting, function(userError, waitingWithUser){
            if(!userError){
                populateClinicInformation(waitingWithUser, function(clinicError, populatedWaiting){
                    if(!clinicError){
                        callback(null, populatedWaiting);
                    }
                    else{
                        callback(clinicError, populatedWaiting);
                    }
                });
            }
            else{
                callback(userError, waiting);
            }
        });
    }
    else{
        callback({name : 'BAD_REQUEST'}, waiting);
    }
}