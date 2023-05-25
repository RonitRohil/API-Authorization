require('dotenv').config();
const {Schema,model, default: mongoose} = require('mongoose')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    first_name: {
        type:String,
        required:true
    },

    last_name: {
        type: String,
        required:true
    },

    email: {
        type: String,
        required:true,
        unique:true
    },

    password: {
        type: String,
        required:true
    },

    phonenumber: {
        type: Number,
        required: true,
        unique: true    
    },

    // tokens: [{
    //     token:{
    //         type: String,
    //         required:true
    //     }
    // }],
})

const user = model('user',userSchema)

module.exports = user