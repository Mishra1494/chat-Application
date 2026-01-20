import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { getConversation } from "../controllers/conversationController.js";

const router = express.Router();

router.get("/:userId", isAuthenticated, getConversation);

export default router;
