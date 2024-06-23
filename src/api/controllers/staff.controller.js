const Staff = require("../models/staff.model.js");
const bcrypt = require("bcrypt");

//update staff details by email
exports.updateStaff = async (req,res)=>{
    try {
        const institute = req.instituteId;
        const email = req.params.email;
        if(email !== req.user.email){
            return res.status(403).send("Data is not matching.");
        }
        const updatedData = req.body;

        //check if the updating data is present
        if(!updatedData){
            return res.status(409).send("Updating data is not present.");
        };

        //hash the password if it was changed
        if(updatedData.password){
            updatedData.password = await bcrypt.hash(updatedData.password , 10);
        }

        //Find and update the staff
        const updatedStaff = await Staff.findOneAndUpdate(
            { email:email, institute:institute },
            updatedData,
            { new: true }
        );

        if(!updatedStaff){
            return res.status(404).send("Staff not found");
        }

        res.status(200).send(updatedStaff);
    } catch (error) {
        console.log("Updating staff error "+error.message);
        res.status(500).send("Server error.");
    }
};

// delete staff by email
exports.deleteStaff = async (req,res)=>{
    try {
        const institute = req.instituteId;
        const email = req.params.email;
        if(email !== req.user.email){
            return res.status(403).send("Data is not matching.");
        }
        const isdeleted = await Staff.findOneAndDelete({ email:email, institute:institute });
        if(!isdeleted){
            return res.status(404).send("Staff not found");
        }
        res.status(200).send("Staff deleted successfully");

    } catch (error) {
        console.log("Deletion error "+error.message);
        res.status(500).send("Server error.");
    }
};

exports.getStaff = async (req,res)=>{
    try {
        const institute = req.instituteId;
        const email = req.params.email;
        const StaffData = await Staff.findOne({ email:email, institute:institute });
        if(!StaffData){
            return res.status(404).send("Staff not found");
        }
        res.status(200).send(StaffData);
    } catch (error) {
        console.log("Getting staff error "+error.message);
        res.status(500).send("Server error.");
    }
};