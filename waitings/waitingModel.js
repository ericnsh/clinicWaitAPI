var UUID = require("node-uuid");
var moment = require("moment");

exports.model = function(){ 
       
    this.generateId = function(){
        this.id = UUID.v4();
    };
    
    this.generateStamp = function(){
        this.timestamp = moment().toDate();
    };
    
    this.toDTO = function(){
        var self = this;
        var dto = {
            id : self.id,
            clinic : {
                id : self.clinic.id,
                name : self.clinic.name,
                address : self.clinic.address,
                phone_number : self.clinic.phone_number,
                location : self.clinic.location,
                waitings : self.clinic.waitings               
            },
            user : {
                id : self.user.id,
                name : self.user.name
            },            
            ranking : self.ranking
        };
        return dto;
    }
}