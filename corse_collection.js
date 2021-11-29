const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    path:{
        type:String,
        required:true
    }
})

const course = new mongoose.model("courses",courseSchema);

module.exports = course
