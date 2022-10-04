const express = require("express")

const app = express();

app.get("/", (req,res) =>{
  res.send("Hello from API")
})

app.listen(6000, ()=> console.log("Server started on port no 6000"))
