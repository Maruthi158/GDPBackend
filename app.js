const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const collection = require('./collection')

app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    })
);



//const uri = "mongodb://localhost:27017/studdy";

const uri="mongodb+srv://Maruthi158:Jethin%401227@cluster0.amapl.mongodb.net/GDP1?retryWrites=true&w=majority";
mongoose.connect(uri).then(() => {
    console.log("connection successfull...")
}).catch((err) => console.log("connection error : ", err))

app.post("/",(req,res)=>{
    res.send("Hello worlf")
}
)
app.post('/login', async(req,res)=>{
    try {
        const { email, password } = req.body;
        const result = await collection.findOne({ email: email })
        const result1 = await bcrypt.compare(password, result.password)
        if (result1) {
            res.json({success:1,message:"successfully login"})
        } else {
            res.json({success:0,error:"password or username is wrong"})
        }
    } catch (err) {
        console.log(err)
    }
})

app.post('/signup', async (req, res) => {
    try {
        const { fname, mname, lname, sid, email, mobile, bod, password } = req.body;
        const check = await collection.findOne({email:email})
        if(check){
            return res.json({success:0,error:"user already exist"})
        }
        hashPassword = await bcrypt.hash(password, 10); //10 is the number of rounds to use when generating a salt and 10 is a by default
        const result = new collection({
            fname,
            mname,
            lname,
            sid,
            email,
            mobile,
            bod,
            password: hashPassword
        });
        await result.save().then(()=>{
            res.json({success:1,message:"Successfully registered"})
        }).catch((err)=>res.json({success:0,error:"Unsuccessfully registered"}))
    } catch (err) {
        res.status(400).send(err);
    }
})

app.listen(3000, console.log("server is ready to run on 3300..."))