const mongoose = require('mongoose');

module.exports.init = async function()
{
    await mongoose.connect( "mongodb+srv://coder:rahulpal@cluster0.b60c2be.mongodb.net/TodoStorage?retryWrites=true&w=majority")
   
.then(()=> console.log("MongoDB Connected"))
.catch((err)=> console.log("mongo Error",err)); 

}

