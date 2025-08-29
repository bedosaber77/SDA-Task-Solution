const express = require("express");
const cors = require("cors");
const DB = require("./config/db.js");
const morgan = require("morgan");
cors.options = {
  origin: "http://localhost:5173",
};

const app = express();
app.use(morgan("dev"));
app.use(cors(cors.options));
app.use(express.json());
app.use("/api/auth", require("./routes/auth.route.js"));
app.use("/api/project", require("./routes/project.route.js"));
app.use("/api/task", require("./routes/task.route.js"));

DB.connectDB();

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
