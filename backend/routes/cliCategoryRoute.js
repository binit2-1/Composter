import { Router } from "express";
import { createCategory, listCategories } from "../controllers/cliCategoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const categoryRouter = Router();

categoryRouter.post("/", authMiddleware, createCategory);
categoryRouter.get("/", authMiddleware, listCategories);

export default categoryRouter;
