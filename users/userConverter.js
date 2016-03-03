var UUID = require("node-uuid");
var bcrypt = require("bcrypt-nodejs");

exports.convertToUser = function(body, callback){
    if(body.name && body.email && body.password){
        var user = {
            id : UUID.v1(),
            name : body.name,
            email : body.email.toLowerCase(),
            password : bcrypt.hashSync(body.password)
        };
        callback(null, user);
    }
    else{
        callback({name : 'CONVERSION_ERROR'});
    }
}

exports.convertToDTO = function(user, callback){
    var dto = {
        id : user.id,
        name : user.name,
        email : user.email
    }
    callback(null, dto);
}
