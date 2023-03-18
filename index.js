import express from "express";
import db from "cyclic-dynamodb";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import { auth, claimCheck } from "express-oauth2-jwt-bearer";

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

//Auth0 Config
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
});

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
// var options = {
//   dotfiles: 'ignore',
//   etag: false,
//   extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
//   index: ['index.html'],
//   maxAge: '1m',
//   redirect: false
// }
// app.use(express.static('public', options))
// #############################################################################

// public
app.get("/api/public", function (req, res) {
  res.json({
    message: "Hey this is a public resource, welcome!",
  });
});

// requires auth
app.get("/api/private", jwtCheck, function (req, res) {
  res.json({
    message: "Whoa this is a private endppoint",
  });
});

const checkClaims = claimCheck((claims) => {
  return claims.permissions.includes("SuperAdmin");
});

app.get("/api/private-scoped", jwtCheck, checkClaims, function (req, res) {
  res.json({
    message: "SUPER ADMINS ONLY!",
  });
});

//working db routes
// // Create or Update an item
// // app.post("/:col/:key", async (req, res) => {
// app.post("/:col", async (req, res) => {
//   console.log(req.body);

//   const col = req.params.col;
//   // const key = req.params.key;
//   const key = uuidv4();
//   console.log(
//     `from collection: ${col} delete key: ${key} with params ${JSON.stringify(
//       req.params
//     )}`
//   );
//   const item = await db.collection(col).set(key, req.body);
//   console.log("body", req.body);
//   console.log(item, "item");
//   console.log(JSON.stringify(item, null, 2));
//   res.json(item).end();
// });

// // Delete an item
// app.delete("/:col/:key", async (req, res) => {
//   const col = req.params.col;
//   const key = req.params.key;
//   console.log(
//     `from collection: ${col} delete key: ${key} with params ${JSON.stringify(
//       req.params
//     )}`
//   );
//   const item = await db.collection(col).delete(key);
//   console.log(JSON.stringify(item, null, 2));
//   res.json(item).end();
// });

// // Get a single item
// app.get("/:col/:key", async (req, res) => {
//   const col = req.params.col;
//   const key = req.params.key;
//   console.log(
//     `from collection: ${col} get key: ${key} with params ${JSON.stringify(
//       req.params
//     )}`
//   );
//   const item = await db.collection(col).get(key);
//   console.log(JSON.stringify(item, null, 2));
//   res.json(item).end();
// });

// // Get a full listing
// app.get("/:col", async (req, res) => {
//   const col = req.params.col;
//   console.log(
//     `list collection: ${col} with params: ${JSON.stringify(req.params)}`
//   );
//   const items = await db.collection(col).list();
//   console.log(JSON.stringify(items, null, 2));
//   res.json(items).end();
// });

// app.get("/test", (req, res) => {
//   res.json({ msg: "testing" }).end();
// });

// // Catch all handler for all other request.
// app.use("*", (req, res) => {
//   res.json({ msg: "no route handler found" }).end();
// });

// // Start the server
app.listen(PORT, () => {
  console.log(`index.js listening on ${PORT}`);
});
