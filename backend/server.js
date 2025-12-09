import express from "express";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import auth from "./auth/auth.js";
import cors from "cors";
import categoryRouter from "./routes/cliCategoryRoute.js";
import componentRouter from "./routes/cliComponentRoute.js";

const app = express();
const port = process.env.PORT || 3000;

//CORS - Support multiple origins for local and production
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "User-Agent"],
    exposedHeaders: ["Set-Cookie"],
    maxAge: 86400, // 24 hours - cache preflight
    preflightContinue: false,
    optionsSuccessStatus: 204
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
//Create Component Route
app.use("/api/components", componentRouter);
//Pull Component Route
app.use("/api/components", componentRouter);
//Count Components Route


//Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

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
