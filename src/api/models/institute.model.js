const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const instituteSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowecase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    unique_code:{
        type:String,
        required:true,
        unique:true
    },
    pincode:{
        type:String,
        required:true,
    },
    college_code:{
        type:String,
        unique:true
    },
});

instituteSchema.pre("save",async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
});

instituteSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password);
};

module.exports = mongoose.model('institute',instituteSchema);