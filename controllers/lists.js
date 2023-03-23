import CyclicDB from "@cyclic.sh/dynamodb";
const db = CyclicDB(process.env.CYCLIC_DB);

import { v4 as uuidv4 } from "uuid";
const listCollection = db.collection("lists");

const getLists = async (req, res, next) => {
  const items = await listCollection.list();
  res.json(items).end();
};

const getList = async (req, res, next) => {
  const key = req.params.id;
  const item = await listCollection.get(key);
  res.json(item);
};

const getUserLists = async (req, res, next) => {
  let userId = req.body.userId;
  const { results } = await listCollection.filter({ userId });
  res.json(results).end();
};

const addList = async (req, res, next) => {
  const key = uuidv4();
  const item = await listCollection.set(key, req.body);
  res.json(item).end();
};

const deleteList = async (req, res, next) => {
  const key = req.params.id;
  const item = await listCollection.delete(key);
  res.json(item).end();
};

const listController = {
  getLists,
  getUserLists,
  getList,
  addList,
  deleteList,
};

export default listController;
