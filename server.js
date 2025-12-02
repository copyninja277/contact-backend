const express = require("express");
const connectdB = require("./config/dbConnection")
const dotenv= require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const cors = require('cors');



connectdB();
const app = express();

const port = process.env.PORT || 5000;
app.use(cors({
  origin: "https://helpful-pie-f90657.netlify.app",
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(express.json());
app.use("/contacts", require("./routes/contactRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use(errorHandler);
// Add a simple ping route
app.get('/', (req, res) => {
  res.send('Server is running fine ');
});

setInterval(() => {
  fetch(SELF_URL)
    .then(() => console.log('Pinged self to stay awake'))
    .catch(err => console.log('Ping failed:', err.message));
}, 2 * 60 * 1000); // every 14 minutes

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})
