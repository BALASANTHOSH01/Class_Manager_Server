const mongoose = require("mongoose");

const academicSchema = new mongoose.Schema({
    department:{
        type:String,
        required:true,
        trim:true,
    },
    year:{
        type:Number,
        required:true,
        trim:true,
    },
    section:{
        type:String,
        required:true,
        trim:true,
    },
});

module.exports = mongoose.model("Academic",academicSchema);
