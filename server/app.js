const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const https = require("https");
const fs = require("fs");

const privateKeyPath = "/etc/nginx/conf.d/dns_ssl/private.key";
const certificatePath = "/etc/nginx/conf.d/dns_ssl/certificate.crt";
const caBundlePath = "/etc/nginx/conf.d/dns_ssl/ca_bundle.crt";

const server =
  process.env.NODE_ENV === "production"
    ? https.createServer(
        {
          key: fs.readFileSync(privateKeyPath),
          cert: fs.readFileSync(certificatePath),
          ca: fs.readFileSync(caBundlePath),
        },
        app,
      )
    : http.createServer(app);
require("dotenv").config();
const { getLatLonForPlace } = require("./controllers/geocode");

app.use(cors());
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
