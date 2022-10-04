const { application } = require("express");
const express = require("express");
// const router = express.Router();
const sharp = require("sharp");
const fs = require("fs")
const multer = require("multer")

const storage = multer.memoryStorage();
const uploads = multer({storage});

const app = express();
app.use(express.json());

app.post("/resize", uploads.single("image"), async(req, res)=>{
    console.log("File", req.file);
    res.send("Image Received successfully")

    await sharp(req.file.buffer)
    .resize({width : 615, height : 350 })
    .toFile("./data/uploads/output.jpg");

    console.log("File saved successfully");
} )


app.listen(6000, ()=>{
    console.log("Server Started on port no 6000");
})