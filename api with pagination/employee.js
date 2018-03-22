const mongoose = require('mongoose');
const mongoosePaginate=require('mongoose-paginate');
var Schema = mongoose.Schema;

const Employee = new Schema({

    

    empname: {
        type: String, 
        required:true,
    },

    empage: {
        type: String, 
        required:true
    },

    empcontact: {
        type: String, 
        required:true   
    }, 
            
    empemail: {
        type: String, 
        required:true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    email: {
        type: String, 
        required:true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    }

});

Employee.plugin(mongoosePaginate);
var employee = mongoose.model('empModel', Employee)
module.exports = employee;