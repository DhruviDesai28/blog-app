const mongoose = require('mongoose');
const postSchema =  mongoose.Schema({
    caption : {required: true, type : String},
    userid : {required: true, type : mongoose.SchemaTypes.ObjectId},
    imageurl : {required: true, type : String},
    date : mongoose.SchemaTypes.Date
})

module.exports = mongoose.model('post',postSchema);