const Staff = require("../models/staff.model.js");
const bcrypt = require("bcrypt");

exports.updateStaffByEmail = async (req,res)=>{
    try {
        const email = req.params.email;
        const updatedData = req.body;
        if(updatedData.password){
            updatedData.password = await bcrypt.hash(updatedData.password , 10);
        }

        //Find and update the staff
        const updatedStaff = await Staff.findOneAndUpdate(
            { email:email },
            updatedData,
            { new: true }
        );

        if(!updatedStaff){
            return res.status(404).send("Staff not found");
        }

        res.status(200).send(updatedStaff);
    } catch (error) {
        console.log("Updating staff error "+error.message);
    }
};

exports.deleteStaff = async (req,res)=>{
    try {
        const email = req.params.email;
        const isdeleted = await Staff.findOneAndDelete({email:email});
        if(!isdeleted){
            return res.status(404).send("Staff not found");
        }
        res.status(200).send("Staff deleted successfully");

    } catch (error) {
        console.log("Deletion error "+error.message);
    }
};

exports.getStaffByEmail = async (req,res)=>{
    try {
        const email = req.params.email;
        const StaffData = await Staff.findOne({email:email});
        if(!StaffData){
            return res.status(404).send("Staff not found");
        }
        res.status(200).send(StaffData);
    } catch (error) {
        console.log("Getting staff error "+error.message);
    }
};