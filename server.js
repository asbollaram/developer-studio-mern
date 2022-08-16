const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const devuser402 = require("./devusermodel");
const middleware = require("./middleware");
const reviewmodel = require("./reviewmodel");
const cors = require("cors");

const app = express();

mongoose.connect("mongodb+srv://mernpro402:welcome123$@cluster0.17hwg.mongodb.net/?retryWrites=true&w=majority").then( () => console.log("DB connected..."));

app.use(express.json());
app.use(cors({origin:"*"}));

// post and router method
// app
app.post("/register", async(req, res) =>{
    try{
        const{fullname,email,mobile,skill,password,confirmpassword} = req.body;

        const exist = await devuser402.findOne({email});
        //
        if(exist){
            console.log(err)
            return res.status(400).send("User registered..");
        }
        //
        if(password != confirmpassword){
            return res.status(403).send("Invalid password");
        }

       let newUser = devuser402({
        fullname,email,mobile,skill,password,confirmpassword
       })
       newUser.save();
       return res.status(200).send("user registered...");
    }
    catch(err){
        console.log(err);
        return res.status(500).send("server error");
    }
})

// login post router requisst

app.post("/login", async (req, res)=>{
    try{
        const {email,password} = req.body;
        const exist = await devuser402.findOne({email});

        if(!exist){
            return res.status(400).send("User not exist")
        }
        if(exist.password != password){
            return res.status(400).send("Password Invalid");
        }

        // jwt import code for authantication

        let playload ={
            user:{
                id:exist.id
            }
        }
        jwt.sign(playload, 'jwtPassword', {expiresIn:36000000},
        (err,token)=>{
            if(err) throw err
            return res.json({token})
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).send("server error");
    }
})

// get router for get the all profile

app.get('/allprofiles', middleware,async(req, res) =>{
    try{
        let allprofiles = await devuser402.find();
        return res.json(allprofiles);
    }
    catch(err){
        console.log(err);
        return res.status(500).send("server error");
    }
})

//get all profile routers

app.get('/myprofile', middleware,async(req, res) =>{
    try{
        let user = await devuser402.findById(reg.user.id)
        return res.json(user);
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Server error");
    }
})
//
app.post('/addreview',middleware,async(req, res) =>{
    try{
        const{taskworker,rating} = req.body;
        const exist = await devuser402.findById(req.user.id);
        const newReview = new reviewmodel({
            taskprovider:exist.fullname,
            taskworker,rating
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).send("server error")
    }
})
// my review router

app.get('/myreview', middleware,async(req, res) =>{
    try{
        let allreviews = await reviewmodel.find();
        let myreview = allreviews.filter(review => review.taskworker.toString() === req.user.id.toString());
        return res.status(200).json(myreview)
    }
    catch(err){
        console.log(err);
        return res.status(500).send("server error")
    }
})

app.get("/",(req, res) =>{
    res.send("<h3>Welcome to profile</h3>")
})
//
app.listen(4002, ()=> console.log("server is runing..."));