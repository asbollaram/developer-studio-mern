const mongoose = require("mongoose");

const reviewmodel = new mongoose.Schema({
    tastprovider:{
        type:String,
        required:true,
    },
    taskworker:{
        type:String,
        required:true,
    },
    rating:{
        type:String,
        required:true
    }
})

module.exports= mongoose.model('reviewmodel', reviewmodel);