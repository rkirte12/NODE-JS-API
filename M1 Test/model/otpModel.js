const mongoose = require("mongoose")


const otpSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    otp : {
        type : Number,
        required : true
    }
},{timestamps : true})

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

module.exports = mongoose.model("OtpData", otpSchema)