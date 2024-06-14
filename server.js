const express = require("express");
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./config/db.js"); // db connection
const authRouter = require("./routes/auth.route.js"); //auth router
const adminRouter = require("./routes/admin.route.js"); //admin router
const staffRouter = require("./routes/staff.route.js"); //staff router

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

// Connect with Database
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});


// Route handling
app.use("/api/auth",authRouter); // authendication routes
app.use("/api/admin",adminRouter); // admin routes
app.use("/api/staff",staffRouter); // staff routes


// Listen to the port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
