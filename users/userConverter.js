var UUID = require("node-uuid");

exports.convertToUser = function(body, callback){
    if(body.name && body.email){
        var user = {
            id : UUID.v1(),
            name : body.name,
            email : body.email
        };
        callback(null, user);
    }
    else{
        callback({name : 'CONVERSION_ERROR'}, null);
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
