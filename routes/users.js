import express from "express";
import userController from "../controllers/users.js";
import auth0Helper from "../auth/index.js";

const router = express.Router();

// TODO: set proper auth for routes

//list users
router.get("/", userController.getUsers);

//get user
router.get("/:id", userController.getUser);

// add user
router.post("/", userController.addUser);

//update user
router.patch("/:id", userController.updateUser);

// delete user
router.delete("/:id", userController.deleteUser);

// check email
router.get("/existing/:email", userController.checkUserEmail);

// get by auth0Id
router.get("/auth0Id/:id", userController.getUserByAuth0Id);

// public test
router.get("/public", userController.publicTest);

// private test
router.get("/private", auth0Helper.jwtCheck, userController.privateTest);

// admin only test
router.get(
  "/admin",
  auth0Helper.jwtCheck,
  auth0Helper.adminClaims,
  userController.privateTest
);

export default router;
