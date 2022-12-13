import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import * as dotenv from "dotenv"
dotenv.config()

const app = express();
app.use(express.json());

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const userAccount = mongoose.model("userModel", userSchema);

const port = process.env.PORT;
const userDB = [];
 
const url = process.env.DB_URL ;
mongoose.set("strictQuery", false);
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB Connected"));

app.get("/user", (req, res) => {
  res.status(200).send(userDB);
});

app.post("/user/register", async (req, res) => {
  const { name, password, email } = req.body;

  const oldUser = await userAccount.findOne({ email: email });
  if (oldUser) return res.send("use another email account");

  const hashedPassword = await bcrypt.hash(password, 10);

  const userInfo = {
    name: name,
    email: email,
    password: hashedPassword,
  };

  userDB.push(userInfo);

  const user = new userAccount({
    name: userInfo.name,
    email: userInfo.email,
    password: userInfo.password,
  });

  user.save();

  res.sendStatus(201);
});

app.post("/user/login", async (req, res) => {
  const { password, email } = req.body;

  const account = await userAccount.findOne({ email });

  if (account == null) return res.status(404).send("User Not Found");

  if (await bcrypt.compare(password, account.password)) {
    res.status(200).send("Login Success");
  } else {
    res.send("Login Failed");
  }
});

app.listen(port, console.log(`lisetning to http://localhost:${port}`));
