import express from "express";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import auth from "./auth/auth.ts";
import cors from "cors";
import categoryRouter from "./routes/cliCategoryRoute.js";

const app = express();
const port = process.env.PORT || 3000;

//CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true,
  })
);

//Better-Auth
app.all("/api/auth/*splat", toNodeHandler(auth));

// Mount express json middleware after Better Auth handler
app.use(express.json());

//Create Category Route
app.use("/api/categories", categoryRouter);
//List Categories Route
app.use("/api/categories", categoryRouter);


//Get Current User Session
app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
