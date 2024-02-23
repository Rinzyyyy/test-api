var express = require("express");
var router = express.Router();
const mg = require("mongoose");
// router.use(bodyParser.json());

const knowledgeSchema = new mg.Schema(
  {
    question: {
      type: String,
      required: [true, "question is required"],
    },
    answer: {
      type: String,
      required: true,
    },
    question_type: {
      type: String,
      required: true,
    },
    updated_at: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true, // Include virtual fields
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id; // Remove _id field
        delete ret.__v; // Remove __v field
      },
    },
  }
);

const knowledgeData = mg.model("knowledgeData", knowledgeSchema);

const getDate = () => {
  const current = new Date();
  const year = current.getFullYear();
  const month = (current.getMonth() + 1).toString().padStart(2, "0");
  const day = current.getDate().toString().padStart(2, "0");
  const hours = current.getHours().toString().padStart(2, "0");
  const minutes = current.getMinutes().toString().padStart(2, "0");
  const seconds = current.getSeconds().toString().padStart(2, "0");
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
};

// const newKnowledge = new knowledgeData({
//   question: "What is the minimum bet amount for each game?",
//   answer:
//     "Due to the differences in each game, customers are advised to check the specific minimum bet amount within each game.",
//   question_type: "game",
//   updated_at: getDate(),
// });

// newKnowledge
//   .save()
//   .then((data) => {
//     console.log("saved", data);
//   })
//   .catch((e) => console.log("failedSave", e));

const searchQuery = {};
const match = (query) => {
  const keys = ["id", "question", "answer", "question", "question_type"];
  keys.forEach((key) => {
    if (query[key]) {
      searchQuery[key] = { $regex: new RegExp(query[key], "i") };
    }
  });
  return searchQuery;
};

router.get("/", async (req, res) => {
  try {
    const resData = {
      data: {},
      error: "",
      pagination: {
        page: req.query.page ?? 1,
        limit: req.query.limit ?? 5,
        total: await knowledgeData.countDocuments(),
      },
    };

    let findData = await knowledgeData
      .find(match(req.query))
      .skip((resData.pagination.page - 1) * resData.pagination.limit)
      .limit(resData.pagination.limit)
      .exec();
    resData.data = findData;
    console.log("find");
    return res.json(resData);
  } catch (e) {
    return res.status(500).json({ message: "get data failed", e });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let findOneData = await knowledgeData.findById(req.params.id).exec();
    return res.json(findOneData);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const newKnowledge = new knowledgeData(data);
    newKnowledge
      .save()
      .then((postData) => res.json({ message: "post success", data: postData }))
      .catch((e) => res.json({ message: e.message }));
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = router;
