const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    email:{
        type:String
    },
    path:{
        type:String
    }
})
