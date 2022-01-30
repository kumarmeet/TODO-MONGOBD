const express = require("express");
const mongodb = require("mongodb");

const db = require("../data/database");
var truncate = require("lodash.truncate");

const router = express.Router();
const ObjectId = mongodb.ObjectId;

router.get("/", (req, res) => {
  res.redirect("/create-todos");
});

router.get("/create-todos", async (req, res) => {
  res.render("add-todos");
});

router.post("/create-todos", async (req, res) => {
  let todoItem = null;

  try {
    todoItem = {
      item: req.body.item,
      date: new Date(),
    };
  } catch (error) {
    return res.status(404).render("404");
  }

  await db.getDb().collection("todo").insertOne(todoItem);

  res.redirect("/");
});

router.get("/todos-list", async (req, res) => {
  let todos = null;

  try {
    todos = await db.getDb().collection("todo").find().toArray();
  } catch (error) {
    return res.status(404).render("404");
  }

  todos.map((val) => {
    return (val.humanReadableDate = val.date.toLocaleDateString("en-US", {
      // weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }));
  });

  //truncate string and add object in todos
  todos.map((val) => {
    return (val.truncatedItem = truncate(val.item, {
      length: 34,
      omission: "....",
    }));
  });

  res.render("todos-list", { todos: todos });
});

router.get("/todo/:id/view", async (req, res) => {
  let todoId = null;

  try {
    todoId = new ObjectId(req.params.id);
  } catch (error) {
    return res.status(404).render("404");
  }

  const todo = await db.getDb().collection("todo").findOne({ _id: todoId });

  res.render("see-todo", { todo: todo });
});

router.post("/todos/:id/delete", async (req, res) => {
  let todoId = null;

  try {
    todoId = new ObjectId(req.params.id);
  } catch (error) {
    return res.status(404).render("404");
  }

  await db.getDb().collection("todo").deleteOne({ _id: todoId });
  res.redirect("/todos-list");
});

router.get("/todos/:id/update", async (req, res) => {
  let todoId = null;

  try {
    todoId = new ObjectId(req.params.id);
  } catch (error) {
    return res.status(404).render("404");
  }

  const todo = await db.getDb().collection("todo").findOne({ _id: todoId });

  res.render("update-todos", { todo: todo });
});

router.post("/todos/:id/update", async (req, res) => {
  let todoId = null;

  try {
    todoId = new ObjectId(req.params.id);
  } catch (error) {
    return res.status(404).render("404");
  }

  console.log(todoId);
  await db
    .getDb()
    .collection("todo")
    .updateOne({ _id: todoId }, { $set: { item: req.body.item } });

  res.redirect("/todos-list");
});

module.exports = router;
