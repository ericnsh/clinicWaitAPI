var config = require('../config/config');
var DocumentClient = require("documentdb").DocumentClient;
var converter = require("../users/userConverter");

const endpoint = config.AZURE_DOCUMENT_DB_URI;
const authorisationKey = config.AZURE_DOCUMENT_DB_PRIMARY_KEY;
const collectionURL = config.AZURE_USERS_COLLECTION_URL;

function queryClient(query, callback){
    var client = new DocumentClient(endpoint, { "masterKey" : authorisationKey});
    client.queryDocuments(collectionURL, query).toArray(function(err, results){
        if(!err){
            if(results[0]){
                converter.convertToDTO(results[0], function(conversionError, user){
                    if(conversionError){
                        console.error('error while converting user with id '+ user.id + ' to DTO')
                        return callback({name : 'CONVERSION_ERROR'});
                    }
                    else{
                        return callback(null, user);
                    }
                });
            }
            else{
                return callback({name : 'USER_NOT_FOUND'});
            }
        }
        else{
            console.error('request error on users.js getUserById : ');
            console.error(err);
            return callback(err);
        }
    });
}

function add(body, callback){
    converter.convertToUser(body, function(conversionError, convertedUser){
        if(!conversionError){
            checkExistence(convertedUser.email, function(existanceCheckingError, results){
                if(!existanceCheckingError){
                    var client = new DocumentClient(endpoint, { "masterKey" : authorisationKey});
                    client.createDocument(collectionURL, convertedUser, function(creationError, createdUser){
                        if(!creationError){
                            converter.convertToDTO(createdUser, function(err, dto){
                                if(err){
                                    console.error('error while converting user with id '+ createdUser.id + ' to DTO');
                                    return callback({name : 'DTO_CONVERSION_ERROR'});
                                }
                                else{
                                    return callback(null, dto);
                                }
                            });
                        }
                        else{
                            console.error('caught on user creation : ');
                            console.error(creationError);
                            callback({name : 'DB_CONNECTION_ERROR'});
                        }
                    });
                }
                else {
                    console.error('caught on user existance checkin : ');
                    console.error(existanceCheckingError);
                    callback(existanceCheckingError);
                }
            });
        }
        else{
            console.error('caught on user conversion during creation : ');
            console.error(conversionError);
            callback({name : 'CONVERSION_ERROR'});
        }
    });
}

function findById(id, callback){
    var query = "SELECT TOP 1 * FROM docs d WHERE d.id='" + id + "'";
    queryClient(query,callback);
}

function findByEmail(email, callback){
    var query = "SELECT TOP 1 * FROM docs d WHERE d.email='" + email + "'";
    queryClient(query,callback);
}

function checkExistence(email, callback){
    findByEmail(email, function(err, user){
        if(err && err.name === 'USER_NOT_FOUND'){
            callback(null, user);
        }
        else{
            callback({name: 'ALREADY_EXISTS'});
        }
    })
}

process.on('uncaughtException', function (err) {
    console.log('unhandled error on users.js : ');
    console.error(err.stack);
});

exports.model = {
    findById : function(id, callback){
        findById(id,callback);
    },
    findByEmail : function(email, callback){
        findByEmail(email, callback);
    },
    add : function(user, callback){
        add(user,callback);
    }
}