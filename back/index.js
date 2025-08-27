const express = require("express");
const cors = require("cors");
const DB = require("./config/db.js");
cors.options = {
  origin: "http://localhost:5173",
};

const app = express();

app.use(cors(cors.options));
app.use(express.json());

DB.connectDB();

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
