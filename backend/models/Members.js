const mongoose = require('mongoose');

const membersSchema = mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,ref:'User',required:true}
})

const membersModel = mongoose.model('Members',membersSchema);

module.exports = {
    membersModel
}