const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    rollno:{
        type:String,
        required:true,
        unique:true,
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
    department:{
        type:String,
        required:true,
    },
    year:{
        type:Number,
        required:true,
    },
    totalPresent:{
        type: Number,
        required:true,
        default:0
    },
    totalAbsent:{
        type: Number,
        required:true,
        default:0
    },
    phoneNumber:{
        type:String,
        required:true
    },
    parentMobile:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:()=> Date.now()
    }
});

studentSchema.pre("save",async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
});

studentSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password);
};

module.exports = mongoose.model("student",studentSchema);