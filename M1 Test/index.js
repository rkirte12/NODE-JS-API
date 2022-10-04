const express = require("express");
const app = express();
require("dotenv").config()
app.use(express.json());
const mongoose = require("mongoose")
const userRoutes = require("./routers/userRoutes")

app.use("/user", userRoutes);

app.get("/", (req,res)=>{
    res.send("Hello from Sample User")
})
mongoose.connect(process.env.MONGO_CONNECTION_URL).then(()=> console.log("Database connceted."));
const port = process.env.PORT;

app.listen(port, ()=>{
    console.log(`Server Started at ${port}`);
})