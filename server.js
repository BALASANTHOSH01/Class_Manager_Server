const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require('body-parser');
const connectDB = require("./src/config/db.js"); // db connection
const authRouter = require("./src/api/routes/auth.route.js"); //auth router
const staffRouter = require("./src/api/routes/staff.route.js"); //staff router
const attendanceRouter = require("./src/api/routes/attendance.route.js");
const studentRouter = require("./src/api/routes/student.route.js");
const instituteRouter = require("./src/api/routes/institute.route.js");

const app = express();
app.use(express.json());
app.use(cors());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Parse application/json
app.use(bodyParser.json());

// Parse raw body
app.use(bodyParser.raw());

// Parse text
app.use(bodyParser.text()); 

const port = process.env.PORT || 3000;

// Connect with Database
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});


// Use routers
app.use("/api/staff", staffRouter);
app.use("/api/auth", authRouter);
app.use("/api/students", studentRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/institute", instituteRouter);


// Listen to the port
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
