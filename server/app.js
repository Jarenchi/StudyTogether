const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
require("dotenv").config();
app.use(cors());
const { setupQuillSocket } = require("./socket");

const port = 5000;
let connectStatus = false;

async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB).then(() => {
      console.log("Connected to MongoDB...");
    });
    connectStatus = true;
  } catch (error) {
    console.log(error);
  }
}

connectMongoDB();

app.use(express.json());

app.use((req, res, next) => {
  if (connectStatus) {
    next();
  } else {
    res.status(503).send({
      status: false,
      message: "Server is not ready",
    });
  }
});
app.get("/test", (req, res) => {
  res.send("Ok");
});

setupQuillSocket(server);

server.listen(port, () => {
  console.log(`the application is running on localhost:${port}`);
});
