import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;

const userDB = [
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

const postDB = [
  { post: "content1" },
  { post: "content2" },
  { post: "content3" },
  { post: "content4" },
  { post: "content5" },
  { post: "content6" },
  { post: "content7" },
  { post: "content8" },
  { post: "content9" },
  { post: "content10" },
];

app.get("/post", Paginated(postDB), (req, res) => {
  res.json(res.paginatedResult);
});

app.get("/user", Paginated(userDB), (req, res) => {
  res.json(res.paginatedResult);
});

function Paginated(model) {
  return (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result = {};

    try {
      if (startIndex > 0) {
        result.previous = {
          page: page - 1,
          limit: limit,
        };
      }
      if (endIndex < model.length) {
        result.next = {
          page: page + 1,
          limit: limit,
        };
      }

      result.resultUser = model.slice(startIndex, endIndex);

      res.paginatedResult = result;
      next();
    } catch (error) {
      res.sendStatus(500);
    }
  };
}

app.listen(port);
