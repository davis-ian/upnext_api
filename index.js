import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 3000;
const app = express();

//Cors Config
const allowedOrigins = process.env.ALLOWED_CORS_ORIGINS.split(",");
app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import usersRoute from "./routes/users.js";

app.use("/users", usersRoute);

// Catch all handler for all other request.
app.use("*", (req, res) => {
  res.json({ msg: "no route handler found" }).end();
});

// // Start the server
app.listen(PORT, () => {
  console.log(`index.js listening on ${PORT}`);
});
