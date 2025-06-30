const express = require("express");
const connectdB = require("./config/dbConnection")
const dotenv= require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const cors = require('cors');



connectdB();
const app = express();

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})
