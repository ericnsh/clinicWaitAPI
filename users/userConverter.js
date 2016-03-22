var User = require("../users/userModel").model; 

exports.convertToNewUser = function(body, callback){
    if(body.name && body.email && body.password){
        var user = new User();
        user.name = body.name;
        user.email = body.email;
        user.password = user.generateHash(body.password);
        user.generateId();
        callback(null, user);
    }
    else{
        callback({name : 'CONVERSION_ERROR'});
    }
}

exports.convertToUser = function(body, callback){
    var user = new User();
    user.id = body.id;
    user.name = body.name;
    user.email = body.email;
    user.password = body.password;
    callback(null, user);
}
