import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;
const url = process.env.URL;

mongoose.set("strictQuery", true);
mongoose.connect(url);

const postSchema = mongoose.Schema({
  post: String,
});

const postModel = mongoose.model("posts", postSchema);

app.get("/post", Paginated(postModel), (req, res) => {
  res.json(res.paginatedResult);
});

function Paginated(model) {
  return async (req, res, next) => {
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
      if (endIndex < (await model.countDocuments().exec())) {
        result.next = {
          page: page + 1,
          limit: limit,
        };
      }

      result.resultUser = await model
        .find()
        .limit(limit)
        .skip(startIndex)
        .exec();

      res.paginatedResult = result;
      next();
    } catch (error) {
      res.sendStatus(500);
    }
  };
}

app.listen(port);
