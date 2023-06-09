import express from "express";
import listController from "../controllers/lists.js";

const router = express.Router();

// TODO: set proper auth for routes

// get lists
router.get("/", listController.getLists);

// get lists
router.get("/by-user/:userId", listController.getUserLists);
// get list
router.get("/:id", listController.getList);
// add list
router.post("/", listController.addList);
router.delete("/:id", listController.deleteList);

export default router;
