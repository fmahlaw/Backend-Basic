import express from "express";
import dotenv from "dotenv"
dotenv.config()
 

const app = express();
const port = process.env.PORT

const users = [
  { name: "user1" },
  { name: "user2" },
  { name: "user3" },
  { name: "user4" },
  { name: "user5" },
  { name: "user6" },
  { name: "user7" },
  { name: "user8" },
  { name: "user9" },
  { name: "user10" },
];

app.get("/user", (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const result = {};

  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  if (endIndex < users.length) {
    result.next = {
      page: page + 1,
      limit: limit,
    };
  }

  result.resultUser = users.slice(startIndex, endIndex);
  res.send(result);
});

app.listen(port);
