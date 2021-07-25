const express = require("express");
const app =  express();
const cors = require("cors");
  
app.use(express.json());
app.use(cors());

app.use("/gpa", require("./route/gpa"));

app.listen(5000, () => { 
    console.log("server is running on port 5000");
});