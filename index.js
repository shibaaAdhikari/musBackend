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
import accountRoutes from "./routes/accounts.js"
import favouriteRoutes from "./routes/favourite.js"
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import playcountRoutes from "./routes/playcount.js"

const app = express();
const port = 3000;

// Parse JSON request bodies
app.use(bodyParser.json());

// Set up CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// Initialize and connect to the database
initializeDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// Set up static routes for images and audio files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(
  "/songs/image",
  express.static(path.join(__dirname, "./uploads/images/"))
);

app.use(
  "/songs/audio",
  express.static(path.join(__dirname, "./uploads/audio"))
);

// Define API routes
app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/artistAccounts", artistAccountsRoutes);
app.use("/api/albums", albumRoutes);
app.use("/uploads/images", imageRoutes);
app.use("/api/favourites",favouriteRoutes);
app.use("/api/playcounts",playcountRoutes)

// Handle file uploads
app.use(express.urlencoded({ extended: false }));

app.post("/upload", (req, res) => {
  // Handle file upload logic here
});

// Handle unknown routes and errors
app.use((req, res, next) => {
  res.json({ message: "Could not find route" });
  return next(createError(404, "Could not find route"));
});
