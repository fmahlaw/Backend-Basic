import express from "express";
const app = express();
const port = 4000;
app.get("/", (req, res) => {
    res.send("hello fo");
});
app.get("/user", (req, res) => {
    res.send("user");
});
app.listen(port, () => console.log("Running" + port));
