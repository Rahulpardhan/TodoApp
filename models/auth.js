const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    });

    const signupData =  mongoose.model("auth",authSchema);

    module.exports = signupData;

