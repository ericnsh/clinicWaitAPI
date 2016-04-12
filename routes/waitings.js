var waitings = require("../waitings/waitings").model;

exports.add = function(req, res){          
    waitings.add(req.params.id, req.body, function(err, waiting){
        if(!err){
            res.status(201).send({waiting : waiting});
        }      
        else{
            if(err.name === 'ALREADY_EXISTS'){
                res.status(409).send({
                    errorCode: 'ALREADY_EXISTS',
                    message: 'user with id ' + req.body.user_id + ' is already lined-up.'
                });
            }
            else if(err.name === 'USER_NOT_FOUND'){
                res.status(404).send({
                   errorCode: 'USER_NOT_FOUND',
                   message: 'user with id ' + req.body.user_id + ' was not found.'
               });
            }
            if(err.name === 'CLINIC_NOT_FOUND'){
                res.status(404).send({
                    errorCode: 'CLINIC_NOT_FOUND',
                    message: 'clinic with the id ' + req.params.id + ' was not found.'
                });
            }
            else
            {
                res.status(500).send({
                    errorCode: 'INTERNAL_ERROR',
                    message: 'please try again or contact the admin if problem persists.'
                });
            }
        }
    });
}