import express from "express";
import bodyParser from "body-parser";
import createError from "http-errors";
import { initializeDb } from "./initDb.js";
import userRoutes from "./routes/users.js";
import adminRoutes from "./routes/admins.js";
import songRoutes from "./routes/songs.js";
import artistAccountsRoutes from "./routes/artistAccounts.js";
import albumRoutes from "./routes/albums.js";
import imageRoutes from "./routes/images.js";

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
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/artistAccounts", artistAccountsRoutes);
app.use("/api/albums", albumRoutes);
app.use("/uploads/images", imageRoutes);
app.use(express.urlencoded({ extended: false }));

app.post("/upload", (req, res) => {});

app.use((req, res, next) => {
  res.json({ message: "Could not find route" });
  return next(createError(404, "Could not find route"));
});
