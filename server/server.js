const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dns = require("dns");

const connectDB = require("./config/db");
const { routes } = require("./routes/route");

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", routes)

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 App is running on port ${PORT}`);
});