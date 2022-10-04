const mongoose = require("mongoose")

// MONGO_CONNECTION_URL = mongodb+srv://Cluster1:Cluster1@cluster0.mtgfqth.mongodb.net/Cluster0?retryWrites=true&w=majority;
mongoose.connect("mongodb+srv://Cluster1:Cluster1@cluster0.mtgfqth.mongodb.net/Cluster0?retryWrites=true&w=majority")
.then(()=> console.log("Data Base connected Successfully"));

const userSchema = new mongoose.Schema({
    userName : String,
    email : String
})

const postSchema = new mongoose.Schema({
    title : String,
    postedBy:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})

const User = mongoose.model("User", userSchema)
const Post = mongoose.model("Post", postSchema)

//Query to find all the posts

// Post.find().then(p=>console.log(p)).catch(err=>console.log(err))

Post.find().populate("postedBy").then(P=>console.log(P)).catch(err=>console.log(err))