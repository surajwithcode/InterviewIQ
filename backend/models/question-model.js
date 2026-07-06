import mongoose from "mongoose";

const questionsSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    // AI Generated Question
    question: {
      type: String,
      required: true,
    },

    // AI Generated Expected Answer
    answer: {
      type: String,
      default: "",
    },

    // User Answer
    userAnswer: {
      type: String,
      default: "",
    },

    // AI Evaluation
    score: {
      type: Number,
      default: 0,
    },

    feedback: {
      type: [String],
      default: [],
    },

    correctAnswer: {
      type: String,
      default: "",
    },

    // AI Explanation
    explanation: {
      type: String,
      default: "",
    },

    // User Doubt
    doubt: {
      type: String,
      default: "",
    },

    // AI Reply for Doubt
    doubtExplanation: {
      type: String,
      default: "",
    },

    // Status
    isAnswered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionsSchema);

export default Question;