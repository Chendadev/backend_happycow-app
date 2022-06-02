const express = require("express");
const formidable = require("express-formidable");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(formidable());

mongoose.connect(process.env.MONGODB_CONNECT);

// routes : 
const userRoutes = require("./routes/user");
app.use(userRoutes);

app.all("*", (req, res) => {
    res.status(404).json({ message: "Page not found" })
})

app.listen(process.env.PORT, () => {
    console.log("Server has started")
})