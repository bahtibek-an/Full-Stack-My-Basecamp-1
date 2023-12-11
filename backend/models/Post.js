const mongoose  = require('mongoose');

const postSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    members:[
        {
            type:mongoose.Types.ObjectId,
            ref:'Members',
        }
    ],
    messages:[
        {
            type:mongoose.Types.ObjectId,
            ref:'Messages',
        }
    ]
    
})
postSchema.methods.toJSON = function () {
    const userObject = this.toObject();

    return userObject;
  };

const postModel = mongoose.model('Post', postSchema);

module.exports = {
    postModel
}