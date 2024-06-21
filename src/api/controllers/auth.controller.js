require("dotenv").config();
const jwt = require("jsonwebtoken");
const Staff = require("../models/staff.model.js");
const Institute = require("../models/institute.model.js");
const uniqueCodeGenerator = require("../Services/uniqueCodeGenerator.js");

//staff register
exports.staffRegister = async (req,res)=>{
    try {
        const role = "Staff";

        const {name,email,password,phoneNumber,depart,year,section,institute} = req.body;

        // check all fields are there
        if(!name || !email || !password || !phoneNumber || !depart || !year || !section || !institute){
            return res.status(409).send("All fields are required.");
        };

        //Check user already exist
        const isExist = await Staff.findOne({email:email});
        if(isExist){
            return res.status(409).send("User already exist");
        };

        const staffData = await Staff.create({name,email,password,phoneNumber,role,assigned_sections: {
            department: depart,
            year: year,
            section: section
        },institute:institute});

        // JWT token creation
        const token = jwt.sign({staff_id:staffData._id,role:"staff"},process.env.JWT_ACCESS_TOKEN,{expiresIn: '5h' });

        res.status(201).json({staffData,token});

    } catch (error) {
        console.log("Staff Register error :"+error.message);
    }
};

//staff login
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
        };

        // JWT token creation
        const token = jwt.sign({staff_id:staffData._id,role:"staff"},process.env.JWT_ACCESS_TOKEN,{expiresIn: '5h' });

        res.status(200).json({staffData,token});

    } catch (error) {
        console.log("Staff Login error :"+error.message);
    }
};

// Create institute account
exports.registerInstitute = async (req, res) => {
    try {
        const { name, email, password, pincode, college_code } = req.body;

        // Validate required fields
        if (!name || !email || !password || !pincode ) {
            return res.status(400).send("All fields are required.");
        }

        // Generate unique code for the institute
        const unique_code = await uniqueCodeGenerator(name, college_code);

        // Create institute account
        const instituteData = await Institute.create({ name, email, password, unique_code, pincode, college_code });

        if (!instituteData) {
            return res.status(500).send("Failed to create institute account.");
        };

          // JWT token creation
          const token = jwt.sign({institute_id:instituteData._id,role:"institute"},process.env.JWT_ACCESS_TOKEN,{expiresIn: '5h' });

          res.status(200).json({instituteData,token}); // Send the created institute data as response

    } catch (error) {
        console.error("Account creation error:", error.message);
        res.status(500).send("An error occurred while creating institute account.");
    }
};

// Institute login
exports.loginInstitute = async (req,res) => {
    try {
        const {email,password}= req.body;
        //check whether the email and password is correct
        if(!email || !password){
            return res.status(404).send("email and password fields are required.");
        };

        const instituteData = await Institute.findOne({email:email});
        if(!instituteData){
            return res.status(404).send("User Not Found");
        }

        const isPasswordCorrect = await instituteData.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(401).send("Incorrect password");
        };

        
        // JWT token creation
        const token = jwt.sign({institute_id:instituteData._id,role:"institute"},process.env.JWT_ACCESS_TOKEN,{expiresIn: '5h' });

        res.status(200).json({instituteData,token});

    }  catch (error) {
        console.error("Account creation error:", error.message);
        res.status(500).send("An error occurred while creating institute account.");
    }
};