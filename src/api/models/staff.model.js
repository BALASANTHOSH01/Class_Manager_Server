const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const staffSchema = new mongoose.Schema({
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
    phoneNumber:{
        type:String,
        required:true,
        trim:true
    },
    role:{
        type:String,
        enum: ['Staff', 'HOD'],
        required:true,
        trim:true
    },
    assigned_sections:{
        department: {
            type: String,
            ref: "Department",  // Assuming you have a Department model
            required: true
        },
        year: {
            type: Number,
            ref: "Year",  // Assuming you have a Year model
            required: true
        },
        section: {
            type: String,
            ref: "Section",  // Assuming you have a Section model
            required:true,
        }
    },
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true
    },
    createdAt:{
        type:Date,
        required:true,
        default:()=> Date.now()
    }
});

staffSchema.pre("save",async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
});

staffSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password);
};

module.exports = mongoose.model("Staff",staffSchema);