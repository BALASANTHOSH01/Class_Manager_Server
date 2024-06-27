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
        lowercase:true,
        trim:true
    },
    year:{
        type:Number, // Number
        required:true,
    },
    section:{
        type:String,
        lowercase:true,
        trim:true
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
    parentNumber:{
        type:String,
        required:true,
    },
    batch:{ // optional
        type:String,
        trim:true
    },
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true
    },
    notifyParents:{
        type:Boolean,
        default:true
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

studentSchema.pre("save",async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
});

studentSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password);
};

module.exports = mongoose.model("Student",studentSchema);