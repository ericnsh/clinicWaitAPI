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
            else if(err.name === 'ALREADY_EXISTS'){
                res.status(409).send({
                    errorCode: 'ALREADY_EXISTS',
                    message: 'user with email ' + req.body.email + ' already exists'
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
                   message: 'User with id ' + req.params.id + ' was not found'
               });
           }
       }
       else{
           if(err.name === 'USER_NOT_FOUND'){
               res.status(404).send({
                   errorCode: 'USER_NOT_FOUND',
                   message: 'User with id ' + req.params.id + ' was not found'
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

exports.findByEmail = function(req, res){
    users.findByEmail(req.query.email, function(err, user){
        if(!err){
           if(user){
               res.status(200).send(user);
           }
           else{
               res.status(404).send({
                   errorCode: 'USER_NOT_FOUND',
                   message: 'User with email ' + req.query.email + ' was not found'
               });
           }
       }
       else{
           if(err.name === 'USER_NOT_FOUND'){
               res.status(404).send({
                   errorCode: 'USER_NOT_FOUND',
                   message: 'User with email ' + req.query.email + ' was not found'
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