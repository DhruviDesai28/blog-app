const mongoose = require('mongoose');
const blogSchema =  mongoose.Schema({
    title : {required: true, type : String},
    userid : {required: true, type : mongoose.SchemaTypes.ObjectId},
    body : {required: true, type : String},
    date:mongoose.SchemaTypes.Date
})

module.exports = mongoose.model('blog',blogSchema);