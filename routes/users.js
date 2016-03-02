var users = require("../users/users").model;

exports.add = function(req, res){
    users.add(req.body, function(err, user){
        if(!err){
            res.status(201).send(user);
        }
        else{
            if(err.name === 'CONVERSION_ERROR'){
                res.status(400).send({
                    errorCode: 'BAD_REQUEST',
                    message: 'please verify your request body'
                });
            }
            else{
                res.status(500).send({
                    errorCode: 'INTERNAL_ERROR',
                    message: 'please try again or contact the admin if problem persists'
                });
            }
        }
    });
}

exports.findById = function(req,res){
    users.findById(req.params.id, function(err, user){
       if(!err){
           if(user){
               res.status(200).send(user);
           }
           else{
               res.status(404).send({
                   errorCode: 'USER_NOT_FOUND',
                   message: 'User with id = ' + id + ' was not found'
               });
           }
       }
       else{
           res.status(500).send({
               errorCode: 'INTERNAL_ERROR',
               message: 'please try again or contact the admin if problem persists'
           });
       }
    });
}