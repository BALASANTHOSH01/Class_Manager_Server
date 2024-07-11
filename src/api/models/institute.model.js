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
        unique:true
    },
    pincode:{
        type:String,
        required:true,
    },
    college_code:{
        type:String,
        unique:true,
        required:true
    },
    notifyParents:{
        type:Boolean,
        default:true
    },
    smsPreferences: {
        sendTime: { type: String, default: '10:00' }, // Default to 10:00 AM
    },
    resetPassword:{
        token:{
            type:String,
        },
        expires:{
            type:Date
        }
    },
    createdAt:{
        type:Date,
        required:true,
        default:()=> Date.now()
    }
});

instituteSchema.pre("save",async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
});

instituteSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password);
};

module.exports = mongoose.model('institute',instituteSchema);