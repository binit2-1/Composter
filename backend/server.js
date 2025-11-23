import express from "express";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import auth from "./auth/auth.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});