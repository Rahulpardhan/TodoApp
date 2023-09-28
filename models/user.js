const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
        todoText:{
           type :String,
           required: true,
        },
        completed:{
            type:Boolean,
        },
        imagePath:{
            type: String,
        },
        
    });

    const user =  mongoose.model("todos",todoSchema);

    module.exports = user;

