var Waiting = require("../waitings/waitingModel").model;

exports.convertToNewWaiting = function(clinicID, body, callback){
    if(clinicID && body.user_id){
        var waiting = new Waiting();
        waiting.generateId();
        waiting.generateStamp();
        waiting.clinic = {
            id : clinicID
        };
        waiting.user = {
            id : body.user_id
        };
        callback(null, waiting);
    }
    else{
        callback({name : 'CONVERSION_ERROR'});
    }
}

exports.convertToWaiting = function(obj, callback){
    var waiting = new Waiting();
    waiting.id = obj.id;
    waiting.clinic = obj.clinic;
    waiting.user = obj.user;
    waiting.timestamp = obj.timestamp;
    callback(null, waiting);
}

exports.convertToWaitingSync = function(obj){
    var waiting = new Waiting();
    waiting.id = obj.id;
    waiting.clinic = obj.clinic;
    waiting.user = obj.user;
    waiting.timestamp = obj.timestamp;
    return waiting;
}