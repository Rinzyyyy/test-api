var express = require("express");
// app.use(bodyParser.json());
var router = express.Router();
const mg = require("mongoose");

const todoSchema = new mg.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const todoListSchema = new mg.Schema({
  name: {
    type: String,
    required: true,
  },
  todo: [todoSchema],
});

const TodoList = mg.model("TodoList", todoListSchema);

//===================== default data============================================

// let todoList = [
//   { id: 1, title: "Buy milk", completed: false },
//   { id: 2, title: "Go to gym", completed: true },
// ];

//==================== mongo add new data=======================================

// const newTodoList = new TodoList({
//   name: "Shopping",
//   todo: [
//     { title: "Buy milk", completed: false },
//     { title: "Go to gym", completed: true },
//   ],
// });

// newTodoList
//   .save()
//   .then((saveTodo) => {
//     console.log("saved", saveTodo);
//   })
//   .catch((e) => console.log("failed", e));

//===================== mongo get data==========================================

// const findTodoList = async () => {
//   try {
//     let data = await TodoList.find({}).exec();
//     (data) => console.log("find", data);
//   } catch (e) {
//     console.log("find failed", e);
//   }
// };

// TodoList.find({})
//   .exec()
//   .then((data) => console.log("find", data))
//   .catch((e) => console.log("find failed", e));

//** find({})return the array of data ,
//** findOne({}) return the first object of data

//===================== update get data=========================================

//  -------- modify --------

// TodoList.updateOne(
//   { name: "Shopping", "todo.title": "Buy chocolate milk" },
//   { $set: { "todo.$.title": "Buy milk" } },
//   { runValidators: true }
// )
//   .exec()
//   .then((m) => console.log("update ok", m))
//   .catch((e) => console.log("update failed", e));

//  -------- Add -----------

const addTodo = (data) =>
  TodoList.updateOne(
    { name: "Shopping" },
    { $push: { todo: data } },
    { runValidators: true }
  ).exec();

//  -------- delete ---------

// TodoList.updateOne(
//   { name: "Shopping" },
//   { $pull: { "todo.title": "Go to zoo" } }
// )
//   .exec()
//   .then((result) => {
//     if (result.nModified > 0) {
//       console.log("Todo deleted successfully");
//     } else {
//       console.log("Todo not found or not deleted");
//     }
//   })
//   .catch((error) => {
//     console.error("Delete failed", error);
//   });

//===================== delete data=============================================

// TodoList.deleteOne({ name: "Shopping"})
//   .exec()
//   .then((m) => console.log("delete", m))
//   .catch((e) => console.log("delete failed", e));

// ===================== API GET /todo ==========================

router.get("/", async (req, res) => {
  try {
    let todoListData = await TodoList.find().exec();
    (data) => console.log("find", data);
    return res.json({ data: todoListData });
  } catch (e) {
    return res.status(500).json({ message: "get data failed" });
  }
});

//  ===================== API POST /todo ========================
router.patch("/", (req, res) => {
  try {
    addTodo(req.body)
      .then((m) => {
        console.log("update ok", m);
        return res.json({ message: "update ok" });
      })
      .catch((e) => {
        console.log("update failed", e);
        return res.json({ message: e.message });
      });

  } catch (e) {
    return res.status(500).json({ message: "patch data failed" });
  }
});

//  ===================== API DELETE /todo ========================

module.exports = router;
