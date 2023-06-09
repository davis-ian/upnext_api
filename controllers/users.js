import CyclicDB from "@cyclic.sh/dynamodb";
const db = CyclicDB(process.env.CYCLIC_DB);

import { v4 as uuidv4 } from "uuid";
const users = db.collection("users");

const testUser = (req, res, next) => {
  res.json({ message: "POST NEW USER" });
};

const publicTest = (req, res, next) => {
  res.json({
    message: "Hey, this is a public resource, welcome!",
  });
};

const privateTest = (req, res, next) => {
  res.json({
    message: "Whoa this is a private endpoint!",
  });
};

const scopedTest = (req, res, next) => {
  res.json({
    message: "SUPER ADMINS ONLY!",
  });
};

const getUsers = async (req, res, next) => {
  const { results: userMetadata } = await users.list();

  const userDetailList = await Promise.all(
    userMetadata.map(async ({ key }) => (await users.get(key)).props)
  );

  res.send(userDetailList);
};

const getUser = async (req, res, next) => {
  const key = req.params.id;
  const item = await users.get(key);
  res.json(item);
};

const addUser = async (req, res, next) => {
  const key = uuidv4();
  const item = await users.set(key, req.body);
  res.json(item).end();

  // Check existing user with email
  // let email = req.body.email;
  // const { results } = await users.filter({ email });
  // const exsitingUser = results[0];

  // if (exsitingUser) {
  //   res.status(400).send("A user with this email already exists!");
  // } else {
  //   const key = uuidv4();
  //   const item = await users.set(key, req.body);
  //   res.json(item).end();
  // }
};

const updateUser = async (req, res, next) => {
  const userId = req.params.id;
  const newData = req.body;

  try {
    const { existingUser } = await users.get(userId);
  } catch (e) {
    console.log(`PATH /users/${userId}`, e.message);
    res.sendStatus(404);
  }

  await users.set(userId, newData);
  const user = {
    ...existingUser,
    ...newData,
  };
  res.send(user);
};

const deleteUser = async (req, res, next) => {
  const key = req.params.id;
  const item = await users.delete(key);
  res.json(item).end();
};

const checkUserEmail = async (req, res, next) => {
  let email = req.params.email;

  const { results } = await users.filter({ email });
  let existing;

  if (results[0]) {
    existing = true;
  } else {
    existing = false;
  }
  res.send({ userExists: existing });
};

const getUserByAuth0Id = async (req, res, next) => {
  let auth0Id = req.params.id;

  const { results } = await users.filter({ auth0Id });

  if (results[0]) {
    res.send(results[0]);
  } else {
    res.status(404).send("User not found");
  }
};

// // Delete an item
// app.delete("/:col/:key", async (req, res) => {
//     const col = req.params.col;
//     const key = req.params.key;
//     console.log(
//       `from collection: ${col} delete key: ${key} with params ${JSON.stringify(
//         req.params
//       )}`
//     );
//     const item = await db.collection(col).delete(key);
//     console.log(JSON.stringify(item, null, 2));
//     res.json(item).end();
//   });
// app.post("/:col", async (req, res) => {
//     console.log(req.body);

//     const col = req.params.col;
//     // const key = req.params.key;
//     const key = uuidv4();
//     console.log(
//       `from collection: ${col} delete key: ${key} with params ${JSON.stringify(
//         req.params
//       )}`
//     );
//     const item = await db.collection(col).set(key, req.body);
//     console.log("body", req.body);
//     console.log(item, "item");
//     console.log(JSON.stringify(item, null, 2));
//     res.json(item).end();
//   });
// Get a full listing
// app.get("/:col", async (req, res) => {
//     const col = req.params.col;
//     console.log(
//       `list collection: ${col} with params: ${JSON.stringify(req.params)}`
//     );
//     const items = await db.collection(col).list();
//     console.log(JSON.stringify(items, null, 2));
//     res.json(items).end();
//   });
// }

const userController = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  checkUserEmail,
  publicTest,
  privateTest,
  scopedTest,
  getUserByAuth0Id,
};

export default userController;
