import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import Question from "../models/question-model.js";
import Session from "../models/session-model.js";
import {
  conceptExplainPrompt,
  questionAnswerPrompt,
} from "../utils/prompts-util.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});





/* ================================
   1. GENERATE QUESTIONS
================================== */
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const prompt = `
Return ONLY valid JSON array. No explanation.

Format:
[
  {
    "question": "string",
    "answer": "string"
  }
]

Generate 15 interview questions.

Role: ${session.role}
Experience: ${session.experience}
Topics: ${session.topicsToFocus}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText =
      response.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("") || "";

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let questions = [];

    try {
      const match = cleanedText.match(/\[[\s\S]*\]/);
      const jsonString = match ? match[0] : cleanedText;
      questions = JSON.parse(jsonString);
    } catch (err) {
      console.log("❌ RAW GEMINI OUTPUT:\n", rawText);
      throw new Error("Invalid JSON from AI");
    }

    const saved = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer || "",
      }))
    );

    session.questions.push(...saved.map((q) => q._id));
    await session.save();

    res.status(201).json({
      success: true,
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   2. CONCEPT EXPLANATION
================================== */
export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    const prompt = conceptExplainPrompt(question);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText =
      response.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("") || "";

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const match = cleanedText.match(/\{[\s\S]*\}/);
    const explanation = JSON.parse(match ? match[0] : cleanedText);

    res.status(200).json({
      success: true,
      data: explanation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   3. GET SESSION
================================== */
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate(
      "questions"
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   4. EVALUATE ANSWER
================================== */
export const evaluateAnswer = async (req, res) => {
  try {
    const { questionId, userAnswer } = req.body;

    if (!questionId || !userAnswer) {
      return res.status(400).json({
        success: false,
        message: "Question ID and User Answer are required",
      });
    }

    const questionDoc = await Question.findById(questionId);

    if (!questionDoc) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const prompt = `
You are a Senior Technical Interviewer.

Evaluate the candidate answer.

Return ONLY valid JSON.

{
  "score": 0,
  "feedback": "",
  "correctAnswer": "",
  "explanation": ""
}

Rules:
- score must be between 0 and 10
- feedback should be short bullet style
- correctAnswer should be detailed
- explanation should explain why score was given

Question:
${questionDoc.question}

Expected Answer:
${questionDoc.answer}

Candidate Answer:
${userAnswer}
`;


    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText =
      response.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("") || "";

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const match = cleanedText.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("Invalid AI Response");
    }

    const result = JSON.parse(match[0]);

    const updatedQuestion = await Question.findByIdAndUpdate(
  questionId,
  {
    userAnswer,
    score: result.score,
    feedback: Array.isArray(result.feedback)
      ? result.feedback.join("\n")
      : result.feedback,
    correctAnswer: result.correctAnswer,
    explanation: result.explanation,
    isAnswered: true,
  },
  { new: true }
);

    res.status(200).json({
      success: true,
      data: updatedQuestion,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const askDoubt = async (req, res) => {
  try {
    const { questionId, doubt } = req.body;

    if (!questionId || !doubt) {
      return res.status(400).json({
        success: false,
        message: "Question ID and doubt are required",
      });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const prompt = `
You are an expert programming teacher.

Question:
${question.question}

Correct Answer:
${question.correctAnswer || question.answer}

Student Doubt:
${doubt}

Explain in very simple language.

Return ONLY JSON.

{
   "explanation":""
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText =
      response.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("") || "";

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const match = cleanedText.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("Invalid AI Response");
    }

    const result = JSON.parse(match[0]);

    question.doubt = doubt;
    question.doubtExplanation = result.explanation;

    await question.save();

    res.status(200).json({
      success: true,
      data: question,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};