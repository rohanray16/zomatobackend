require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const apiRouter = require("./app/router/api-router");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // get post data

app.use("/api", apiRouter);

console.log("connecting to db...");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, function () {
      console.log("connected !!!");
      console.log(
        `zomato api is running on http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
