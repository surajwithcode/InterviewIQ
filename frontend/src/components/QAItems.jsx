import { useState } from "react";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const QAItem = ({ item, onPin }) => {
  const [userAnswer, setUserAnswer] = useState(
    item.userAnswer || ""
  );

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(item);

  const [doubt, setDoubt] = useState("");

  const [asking, setAsking] = useState(false);

  const handleCheckAnswer = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        API_PATHS.AI.EVALUATE_ANSWER,
        {
          questionId: item._id,
          userAnswer,
        }
      );

      setResult(res.data.data);
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.message ||
          "Failed to evaluate answer"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAskDoubt = async () => {
    try {
      setAsking(true);

      const res = await axios.post(
        API_PATHS.AI.ASK_DOUBT,
        {
          questionId: item._id,
          doubt,
        }
      );

      setResult(res.data.data);
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.message ||
          "Failed to ask doubt"
      );
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 border mb-4">

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">
          {item.question}
        </h2>

        <button onClick={() => onPin?.(item._id)}>
          {item.pinned ? "📌" : "📍"}
        </button>
      </div>

      <textarea
        rows={5}
        value={userAnswer}
        onChange={(e) =>
          setUserAnswer(e.target.value)
        }
        placeholder="Write your answer here..."
        className="w-full border rounded-lg p-3"
      />

      <button
        onClick={handleCheckAnswer}
        disabled={loading}
        className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Checking..." : "Check Answer"}
      </button>

      {result.isAnswered && (
        <div className="mt-5 space-y-4">

          <div className="bg-green-50 border rounded-lg p-3">
            <h3 className="font-bold">
              Score: {result.score}/10
            </h3>
          </div>

          <div className="bg-blue-50 border rounded-lg p-3">
            <h3 className="font-semibold mb-2">
              Feedback
            </h3>

            <p>{result.feedback}</p>
          </div>

          <div className="bg-yellow-50 border rounded-lg p-3">
            <h3 className="font-semibold mb-2">
              Correct Answer
            </h3>

            <p>{result.correctAnswer}</p>
          </div>

          <div className="bg-purple-50 border rounded-lg p-3">
            <h3 className="font-semibold mb-2">
              AI Explanation
            </h3>

            <p>{result.explanation}</p>
          </div>

          <div className="border rounded-lg p-3">

            <h3 className="font-semibold mb-2">
              Ask Doubt
            </h3>

            <input
              type="text"
              value={doubt}
              onChange={(e) =>
                setDoubt(e.target.value)
              }
              placeholder="Ask your doubt..."
              className="w-full border rounded p-2"
            />

            <button
              onClick={handleAskDoubt}
              disabled={asking}
              className="mt-3 bg-purple-600 text-white px-4 py-2 rounded"
            >
              {asking ? "Asking..." : "Ask AI"}
            </button>

            {result.doubtExplanation && (
              <div className="mt-4 bg-slate-50 border p-3 rounded">
                <h4 className="font-semibold mb-2">
                  AI Reply
                </h4>

                <p>{result.doubtExplanation}</p>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
};

export default QAItem;

