var config = require('../config/config');
var DocumentClient = require("documentdb").DocumentClient;
var converter = require("../waitings/waitingConverter");
var populator = require("../waitings/waitingPopulator");
var _ = require("underscore");

const endpoint = config.AZURE_DOCUMENT_DB_URI;
const authorisationKey = config.AZURE_DOCUMENT_DB_PRIMARY_KEY;
const collectionURL = config.AZURE_WAITINGS_COLLECTION_URL;

function queryClient(query, callback){
    var client = new DocumentClient(endpoint, { "masterKey" : authorisationKey});
    client.queryDocuments(collectionURL, query).toArray(function(err, results){
        if(!err){
            if(results[0]){
                converter.convertToWaiting(results[0], function(conversionError, waiting){
                    if(!err){
                        return callback(null, waiting);
                    }
                    else{
                        console.error('error while converting Waiting with id '+ createdWaiting.id + ' to DTO');
                        return callback({name : 'DTO_CONVERSION_ERROR'});
                    }
                });
            }
            else{
                return callback({name : 'WAITING_NOT_FOUND'});
            }
        }
        else{
            console.error('request error on waiting.js queryClient : ');
            console.error(err);
            return callback({name : 'DB_CONNECTION_ERROR'});
        }
    });
}

function queryClientForMultipleResults(query, callback){
    var client = new DocumentClient(endpoint, { "masterKey" : authorisationKey});
    client.queryDocuments(collectionURL, query).toArray(function(err, results){
        if(!err){
            if(results){
                waitings = _.map(results, function(waiting){
                    return converter.convertToWaitingSync(waiting);
                });
                return callback(null, waitings);
            }
            else{
                return callback({name : 'WAITING_NOT_FOUND'});
            }
        }
        else{
            console.error('request error on waiting.js queryClient : ');
            console.error(err);
            return callback({name : 'DB_CONNECTION_ERROR'});
        }
    });
}

function add(clinicID, body, callback){
    converter.convertToNewWaiting(clinicID, body, function(conversionError, convertedWaiting){
        if(!conversionError){            
            checkExistence(convertedWaiting.clinic.id, convertedWaiting.user.id, function(existanceCheckingError, results){
                if(!existanceCheckingError){  
                    populator.populateWaiting(convertedWaiting, function(fillingError, populatedWaiting){
                        if(!fillingError){
                            var client = new DocumentClient(endpoint, { "masterKey" : authorisationKey});                   
                            client.createDocument(collectionURL, populatedWaiting, function(creationError, createdWaiting){
                                if(!creationError){
                                    converter.convertToWaiting(createdWaiting, function(err, waiting){
                                        if(!err){                                           
                                            calculateWaitings(waiting.clinic.id, function (calcError, count){
                                                if(!calcError){                                                  
                                                    waiting.clinic.waitings = count;
                                                }
                                                return callback(null, waiting);
                                            });
                                        }
                                        else{
                                            console.error('error while converting Waiting with id '+ createdWaiting.id + ' to DTO');
                                            return callback({name : 'DTO_CONVERSION_ERROR'});
                                        }
                                    });
                                }
                                else{
                                    console.error('caught on Waiting creation : ');
                                    console.error(creationError);
                                    callback({name : 'DB_CONNECTION_ERROR'});
                                }
                            });
                        }
                        else{
                            console.error('caught on Waiting user and clinic filling');
                            console.error(fillingError);
                            callback(fillingError, populatedWaiting);
                        }
                    });                                                   
                }
                else {
                    console.error('caught on waiting existance checkin');
                    console.error(existanceCheckingError);
                    callback(existanceCheckingError);
                }
            });          
        }
        else{
            console.error('caught on Waiting conversion during creation : ');
            console.error(conversionError);
            callback({name : 'CONVERSION_ERROR'});
        }
    });
}

function find(clinicID, userID, callback){
    var query = "SELECT TOP 1 * FROM docs d WHERE d.clinic.id='" + clinicID + "' AND d.user.id='" + userID + "'";
    queryClient(query, callback);
}

function calculateWaitings(clinicID, callback){
    var query = "SELECT * FROM docs d WHERE d.clinic.id='" + clinicID + "'";
    queryClientForMultipleResults(query, function(err, results){
        console.log(results);
        if(!err){
            callback(null, _.size(results));
        }
        else{
            console.log('errrrrr0');
            callback(err, 0);
        }
    });
}

function checkExistence(clinicID, userID, callback){
    find(clinicID, userID, function(err, waiting){
        if(err && err.name === 'WAITING_NOT_FOUND'){
            callback(null, waiting);
        }
        else if(err && err.name === 'DB_CONNECTION_ERROR'){
            callback(err);
        }
        else{
            callback({name : 'ALREADY_EXISTS'});
        }
    });
}

process.on('uncaughtException', function (err) {
    console.log('unhandled error on waiting : ');
    console.error(err.stack);
});

exports.model = {
    add : function(clinicID, body, callback){
        add(clinicID, body, callback);
    },
    getWaitings : function(clinicID, callback){
        calculateWaitings(clinicID, callback);
    }
}