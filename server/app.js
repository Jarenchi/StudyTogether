import mongoose from "mongoose";
import express from "express";
import "dotenv/config";

const app = express();
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
app.get("/healthcheck", (req, res) => {
  res.send("Ok");
});

app.listen(port, () => {
  console.log(`the application is running on localhost:${port}`);
});
