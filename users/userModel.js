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
        var obj = this.toJSON();
        var dto = {
            id : obj.id,
            name : obj.name,
            email : obj.email
        };
        return dto;
    }
}