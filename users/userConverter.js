var User = require("../users/userModel").model; 

exports.convertToNewUser = function(obj, callback){
    if(obj.name && obj.email && obj.password && obj.health_insurance_number){
        var user = new User();
        user.name = obj.name;
        user.email = obj.email;
        user.health_insurance_number = obj.health_insurance_number;
        user.password = user.generateHash(obj.password);
        user.generateId();
        callback(null, user);
    }
    else{
        callback({name : 'CONVERSION_ERROR'});
    }
}

exports.convertToUser = function(obj, callback){
    var user = new User();
    user.id = obj.id;
    user.name = obj.name;
    user.email = obj.email;
    user.password = obj.password;
    user.health_insurance_number = obj.health_insurance_number
    callback(null, user);
}
