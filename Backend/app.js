const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const apiRoutes = require("./routers/api.js");
const { transporter } = require("./config/nodemailer.js");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`), connectDB();
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Error:", error);
  } else {
    console.log("SMTP Connected!");
  }
});

