const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
    instituteName:{
        type:String,
        required:true,
        trim:true
    },
    university:{
        type:String,
        trim:true
    },
    collegeCode:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    adminName:{
        type:String,
        trim:true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    createdAt:{
        type:Date,
        required:true,
        default:()=> Date.now()
    }
});

adminSchema.pre("save",async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
});

adminSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password);
};

module.exports = mongoose.model("Admin",adminSchema);