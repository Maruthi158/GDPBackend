const mongoose = require('mongoose')

// create Schema for collection
const studentSchema = new mongoose.Schema({
    fname:{
        type:String,
        require:true
    },
    mname:{
        type:String,
        default:""
    },
    lname:{
        type:String,
        require:true
    },
    sid:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    mobile:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
})

const collection = new mongoose.model("students", studentSchema);

module.exports = collection