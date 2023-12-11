const mongoose = require('mongoose');

const messagesSchema = mongoose.Schema({
    text: {
        type: String,
        required:true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required:true
    },
    default:[]
})

const messageModel = mongoose.model('Messages',messagesSchema);

module.exports = {
    messageModel
}