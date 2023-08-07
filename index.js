require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const arweaveMailer = require("./services/arweave-mailer.js");
const ValidateRequestBody = require("./middlewares/validate-req-body.js");
const monitor = require("./services/monitor.js");
const HTTP_PORT = process.env.HTTP_PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.post(
  "/api/v1/arweave-mailer",
  ValidateRequestBody,
  arweaveMailer.createSubscription
);

app.use((req, res) => {
  res.status(404).json({ error: true, message: "Route not found" });
});

app.use((err, req, res) => {
  res.status(500).json({ error: true, message: "Internal server error" });
});

monitor().catch((e) => {
  throw e;
});

app.listen(HTTP_PORT, () =>
  console.log(`Application running on port: ${HTTP_PORT} `)
);
