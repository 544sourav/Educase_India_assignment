const express = require("express");
const mySqlPool = require("./database/config");
require("dotenv").config();
const schoolRoutes = require("./routes/schoolRoutes")

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use("/api",schoolRoutes );

app.get("/", (req, res) => {
  res.send("<h1>Server is running</h1>");
});

const startServer = async () => {
  try {
    await mySqlPool.query("SELECT 1");
    console.log("MySQL DB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MySQL DB:", error);
    process.exit(1); 
  }
};

startServer();
