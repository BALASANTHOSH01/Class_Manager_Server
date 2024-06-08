require("dotenv").config();
const db = require("../Model/db.js");


exports.createUser = async (req, res) => {
    try {

        const { institute, university, college_code, email, pincode } = req.body;
        const value = [institute, university, college_code, email, pincode];

        let query = `INSERT INTO ${process.env.DB_TABLE} (institute,university,code,email,pincode) VALUES (?,?,?,?,?)`;

        await db.query(query,value);

        res.json({ message: `${institute}'s data  created successfully!` });

    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).send({ message: "Failed to create user" });
    };
};