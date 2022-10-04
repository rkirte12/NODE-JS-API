const mongoose = require("mongoose");

const staticModel = mongoose.Schema({
    type:{
        type: String,
        required : true
    },
    title:{
        type: String,
        required : true
    },
    description:{
        type: String,
        required : true
    },
    status:{
        type: String,
        required : true
    }
})

module.exports = mongoose.model("staticModel", staticModel)

mongoose.model("staticModel", staticModel).find({type : "Static"}, async(err,result)=>{
    
    if (err) {
        console.log(err);
    } else if(result.length !=0){
        console.log("Default Static Model");
    }   
    else {
        const staticContent = {

            type : "Static",
            title : "Static Model",
            description : "static Content Model",
            status : "Verified"
        }
        mongoose.model("staticModel", staticModel).create(staticContent, (err,result1)=>{
            if (err) {
                console.log(err);
            } else {
                console.log("Default Static Content Model created");
            }
        })
    }
    
})