const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    firstName :{
        type : String,
        required : true
    },
    lastName :{
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    
    mobileNumber :{
        type : Number,
        required : true
    },
    countryCode : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    dateOfBirth : {
        type : Date,
        required: true
    },
    userType : {
        type : String,
        required : true
    }
})




module.exports = mongoose.model("UserData", userSchema)


mongoose.model("UserData", userSchema).find({userType : "ADMIN"}, async (err, result)=>{
    if (err) {
        console.log("Default Admin Error", err);
    } else if (result.length != 0) {
        console.log("Default Admin");
    }else{
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash("Rahul@123", salt)

        const admin = {
            firstName : "Rahul",
            lastName : "Kirte",
            email : "rahul.kirte@indicchain.com",
            mobileNumber : "9370510109",
            countryCode : "+91",
            password : hashPassword,
            address : "Narhe Pune",
            dateOfBirth : "12/11/1995",
            userType:"ADMIN"
        };
        mongoose.model("UserData", userSchema).create(admin, (err1, result1)=>{
            if (err1) {
                console.log("Admin creation error", err1);
            } else {
                console.log("Default Admin created", result1);
            }
        });
    }
});