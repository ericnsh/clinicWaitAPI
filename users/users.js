var config = require('../config/config');
var DocumentClient = require("documentdb").DocumentClient;
var converter = require("../users/userConverter");

const endpoint = config.AZURE_DOCUMENT_DB_URI;
const authorisationKey = config.AZURE_DOCUMENT_DB_PRIMARY_KEY;
const collectionURL = config.AZURE_USERS_COLLECTION_URL;

function queryClient(query, callback){
    var client = new DocumentClient(endpoint, { "masterKey" : authorisationKey});
    client.queryDocuments(collectionURL, query).toArray( function(err, results){
        if(!err){
            if(results[0]){
                converter.convertToDTO(results[0], function(err,user){
                    if(err){
                        console.error('error while converting user with id '+ createdUser.id + ' to DTO');
                    }
                    callback(null, user);
                });
            }
            else{
                callback(null, null);
            }
        }
        else{
            console.log('caught on users.js getUserById : ');
            console.error(err);
            callback(err, null);
        }
    });
}

function add(user, callback){
    converter.convertToUser(user, function(conversionError, convertedUser){
        if(!conversionError){
            var client = new DocumentClient(endpoint, { "masterKey" : authorisationKey});
            client.createDocument(collectionURL, convertedUser, function(creationError, createdUser){
                if(!creationError){
                    converter.convertToDTO(createdUser, function(err, dto){
                        if(err){
                            console.error('error while converting user with id '+ createdUser.id + ' to DTO');
                        }
                        callback(null, dto);
                    });
                }
                else{
                    console.log('caught on user creation : ');
                    console.error(creationError);
                    callback(creationError, null);
                }
            });
        }
        else{
            console.log('caught on user conversion during creation : ');
            console.error(conversionError);
            callback(conversionError, null);
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