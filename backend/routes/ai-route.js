import express from "express";
import { protect } from "../middlewares/auth-middleware.js";

import {
  generateInterviewQuestions,
  generateConceptExplanation,
  evaluateAnswer,
  askDoubt,
} from "../controller/ai-controller.js";

const router = express.Router();

router.post(
  "/generate-questions",
  protect,
  generateInterviewQuestions
);

router.post(
  "/generate-explanation",
  protect,
  generateConceptExplanation
);

// NEW
router.post(
  "/check-answer",
  protect,
  evaluateAnswer
);

// NEW
router.post(
  "/ask-doubt",
  protect,
  askDoubt
);

export default router;