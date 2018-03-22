const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const User = new Schema({

    

    name: {
        type: String, 
        required:true,
    },

    age: {
        type: String, 
        required:true
    },

    contact: {
        type: String, 
        required:true   
    }, 
            
    email: {
        type: String, 
        required:true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    
    password: {
        
        type: String, 
        required:true
    }

});

var user = mongoose.model('userModel', User)
module.exports = user;