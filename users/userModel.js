var UUID = require("node-uuid");
var bcrypt = require("bcrypt-nodejs");

exports.model = function(){ 
       
    this.generateId = function(){
        this.id = UUID.v1();
    };
    
    this.generateHash = function(password){
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };
    
    this.validatePassword = function(password){
        return bcrypt.compareSync(password, this.password);
    };
    
    this.toDTO = function(){
        var self = this;
        var dto = {
            id : self.id,
            name : self.name,
            email : self.email
        };
        return dto;
    }
}