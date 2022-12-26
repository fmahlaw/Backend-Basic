import express, { Express, Request, Response } from "express";

const app = express();
const port = 4000 as number;

app.get("/", (req: Request, res: Response) => {
  res.send("hello fo");
});

app.get("/user", (req: Request, res: Response) => {
  res.send("user");
});

app.listen(port, () => console.log("Running" + port));
