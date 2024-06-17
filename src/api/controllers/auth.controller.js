const Staff = require("../models/staff.model.js");
const Admin = require("../models/admin.model.js");

exports.staffRegister = async (req,res)=>{
    try {
        const role = "Staff";

        const {name,email,password,phoneNumber,depart,year,section} = req.body;

        //Check user exist
        const isExist = await Staff.findOne({email:email});
        if(isExist){
            return res.status(409).send("User already exist");
        }

        const staffData = await Staff.create({name,email,password,phoneNumber,role,assigned_sections: {
            department: depart,
            year: year,
            section: section
        }});

        res.status(201).send(staffData);

    } catch (error) {
        console.log("Staff Register error :"+error.message);
    }
}

exports.staffLogin = async (req,res)=>{
    try {
        const{email,password} = req.body;

        if(!email || !password){
            res.send("Invalid user credentials");
        }

        const staffData = await Staff.findOne({email:email});
        if(!staffData){
            return res.status(404).send("User Not Found");
        }

        const isPasswordCorrect = await staffData.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(401).send("Incorrect password");
        }

        res.status(200).send(staffData);

    } catch (error) {
        console.log("Staff Login error :"+error.message);
    }
}

exports.adminRegister = async (req,res)=>{
    try {
        const {instituteName,university,collegeCode,adminName,email,password} = req.body;

        const isExist= await Admin.findOne({email:email});
        if(isExist){
            return res.status(409).send("Account already exists");
        }

        const adminData = await Admin.create({instituteName,university,collegeCode,adminName,email,password});
        res.status(201).send(adminData);

    } catch (error) {
        console.log("Admin Register error :"+error.message);
    }
}

exports.adminLogin = async (req,res)=>{
    try {
        const{email,password} = req.body;

        if(!email || !password){
            res.send("Invalid user credentials");
        }

        const adminData = await Admin.findOne({email:email});
        if(!adminData){
            return res.status(404).send("User Not Found");
        }

        const isPasswordCorrect = await adminData.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(401).send("Incorrect password");
        }

        res.status(200).send(adminData);

    } catch (error) {
        console.log("Admin Login error :"+error.message);
    }
}

