const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
require("dotenv").config();
const { getLatLonForPlace } = require("./controllers/geocode");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }),
);
const { setupQuillSocket } = require("./socket");
const userRouter = require("./routes/user");
const clubRouter = require("./routes/clubs");

const port = 5000;
let connectStatus = false;

async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB).then(() => {
      console.log("Connected to MongoDB");
    });
    connectStatus = true;
  } catch (error) {
    console.log(error);
  }
}

connectMongoDB();

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
app.use(express.json());

app.use("/api/1.0/user", userRouter);
app.use("/api/1.0/clubs", clubRouter);

//TODO:把LAT,LON存起來
app.post("api/geocode", getLatLonForPlace);

app.get("/test", (req, res) => {
  res.send("Ok");
});

setupQuillSocket(server);

server.listen(port, () => {
  console.log(`the application is running on localhost:${port}`);
});
