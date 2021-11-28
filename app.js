const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const collection = require('./collection')
const jwt = require('jsonwebtoken')
const course = require('./corse_collection')
const multer = require('multer')
const fs = require('fs')
const cors=require("cors")
const Authentication = require('./methods/authentication')
let token;

app.use(cookieParser())
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: "GET,PUT,POST,DELETE",
    credentials:true
}))
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

app.get('/auth', async (req, res) => {
    if (typeof (req.cookies.jwtToken) !== "undefined") {
        const cookie = req.cookies.jwtToken;
        const verifyToken = jwt.verify(cookie, "BearcatStudyBuddyProject")
        const verifyUser = await collection.findOne({ _id: verifyToken._id, token: cookie })
        if (!verifyUser)
            res.send(false)
        else
            res.send(true)
    }
})


app.get('/fetchData', Authentication, async (req, res) => {
    try {
        const user = req.user;
        const result = await course.findOne({ email: user.email })
        if (result) {
            const fileName = './' + result.path;
            const Data = await fs.readFileSync(fileName, "utf-8")
            res.send(Data)
        }
    } catch (err) {
        console.log(err)
    }
})

app.get('/dashboard', Authentication, async (req, res) => {
    try {
        const user = req.user;
        res.send({ success: 1 })
    } catch (err) {
        console.log(err)
    }
})



app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await collection.findOne({ email: email })
        const result1 = await bcrypt.compare(password, result.password)
        if (result1) {

            // we are genrating token
            token = jwt.sign({ _id: result._id }, "BearcatStudyBuddyProject");
            result.token = token;
            await result.save();

            res.cookie("jwtToken", token, {
                expires: new Date(Date.now() + 172800000),
                httpOnly: true
            })

            res.json({ success: 1 })
        } else {
            res.json({ success: 0, error: "password or username is wrong" })
        }
    } catch (err) {
        console.log(err)
    }
})

app.post('/signup', async (req, res) => {
    try {
        const { fname, mname, lname, sid, email, mobile, bod, password } = req.body;
        const check = await collection.findOne({ email: email })
        if (check) {
            return res.json({ success: 0, error: "user is an already exist" })
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
        await result.save().then(async () => {

            token = jwt.sign({ _id: result._id }, "BearcatStudyBuddyProject");
            result.token = token;
            await result.save();

            res.cookie("jwtToken", token, {
                expires: new Date(Date.now() + 900000),
                httpOnly: true
            })

            res.json({ success: 1 })
        }).catch((err) => res.json({ success: 0, error: "Unsuccessfully registered" }))
    } catch (err) {
        res.status(400).send(err);
    }
})

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./storage/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname);
    }
})

const upload = multer({ storage: fileStorageEngine })

app.post("/course", upload.single("file"), async (req, res) => {
    try {
        // console.log(req)
        const cookie = req.cookies.jwtToken;
        const verifyToken = jwt.verify(cookie, "BearcatStudyBuddyProject")
        const verifyUser = await collection.findOne({ _id: verifyToken._id, token: cookie })
        const filePath = './storage/' + req.file.filename;
        const email = verifyUser.email
        const result = new course({ email: email, path: filePath })
        await result.save()
        // res.send()
        res.json({ success: 1 })
        res.send("success")
    } catch (err) {
        console.log(err)
        // res.send(err)
        res.json({ success: 0, error: 'Database Error' })
    }
})

app.listen(3300, console.log("server is ready to run on 3300..."))
