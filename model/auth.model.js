require('dotenv').config();
const {Schema,model, default: mongoose} = require('mongoose')

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
})

const user = model('user',userSchema)

module.exports = user