var express = require("express");
// app.use(bodyParser.json());
var router = express.Router();

let todoList = [
  { id: 1, title: "Buy milk", completed: false },
  { id: 2, title: "Go to gym", completed: true },
];

// GET /todos
router.get("/", (req, res) => {
  try {
    return res.json({ data: todoList });
  } catch (e) {
    return res.status(500).json({ message: "get data failed" });
  }
});

// POST /todos
router.patch("/", (req, res) => {
  try {
    const todo = req.body;
    todoList.push(...todo);
    return res.json({ message: "patch data success" });
  } catch (e) {
    return res.status(500).json({ message: "patch data failed" });
  }
});

module.exports = router;
