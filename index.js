import express from "express";
import bodyParser from "body-parser";
import createError from "http-errors";
import { initializeDb } from "./initDb.js";
import userRoutes from "./routes/users.js";

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

// Initialize and connect to the PostgreSQL database
initializeDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  res.json({ message: "Could not find route" });
  return next(createError(404, "Could not find route"));
});