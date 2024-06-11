const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Router/AuthRouter.js");
const studentRouter = require("./Router/StudentsRouter.js");

require("dotenv").config();
const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/auth",AuthRouter);
app.use("/attendance",studentRouter);

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});