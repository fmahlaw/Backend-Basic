import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";
import mongoStore from "connect-mongo";
import session from "express-session";
dotenv.config();

const { PORT, URL } = process.env;
const app = express();

const store = mongoStore.create({
  mongoUrl: URL,
  collectionName: "newSession",
});

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
});

const userAccount = mongoose.model("usermodels", userSchema);
mongoose.set("strictQuery", false);
mongoose.connect(URL);

app.get("/dashboard", sessionAuth, (req, res) => {
  res.send("Page");
});

app.post("/register", async (req, res) => {
  const { name, password } = req.body;

  const oldUser = await userAccount.findOne({ name });
  if (oldUser) return res.send("use another account");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new userAccount({
    name,
    password: hashedPassword,
  });

  user.save();
  req.session.isAuth = true;
  res.status(201).json(req.session.id);
});

app.post("/login", sessionAuth, async (req, res) => {
  const { password, name } = req.body;

  const account = await userAccount.findOne({ name });

  if (!account) return res.status(404).send("User Not Found");

  if (await bcrypt.compare(password, account.password)) {
    return res.status(200).send("Login Success");
  } else {
    return res.send("Login Failed");
  }
});

async function sessionAuth(req, res, next) {
  const { session } = req;

  store.get(session.id, (err, data) => {
    if (!data) return res.sendStatus("403");

    next();
  });
}
app.listen(PORT, console.log(`lisetning to http://localhost:${PORT}`));
