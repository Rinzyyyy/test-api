var express = require("express");
var router = express.Router();

const users = [
  { id: 1, username: "user1", password: "password1", token: "token123" },
  { id: 2, username: "user2", password: "password2", token: "token456" },
];

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Missing token" });
  }

  const user = users.find((u) => u.token === token);

  if (!user) {
    return res.status(403).json({ message: "Forbidden - Invalid token" });
  }
  req.user = user;
  next();
};

router.get("/", authenticateToken, (req, res, next) => {
  const userId = req.user.id;
  const username = req.user.username;
  const data = { userId, username };
  try {
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ message: "get data failed" });
  }
});

module.exports = router;
