const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    passwordHash:{
        type:String,
        unique:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    posts:[
        {
            type:mongoose.Types.ObjectId,
            ref:'Post'
        }
    ],
    members: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Members',
        }
    ]
})

const userModel =  mongoose.model('User', userSchema);

module.exports = {
    userModel
}