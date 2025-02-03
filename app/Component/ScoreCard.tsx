import React from "react";
import { ScoreCardProps } from "../Interfaces/quiz-app";

const ScoreCard: React.FC<ScoreCardProps> = ({ quizResult, questions, name }) => {
  // Calculating the passing percentage
  const passPercentage = 60;
  const percentage = (quizResult.score / (questions.length * 5)) * 100;
  const status = percentage >= passPercentage ? "Pass" : "Fail";

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold">Hello, {name}. Here is your Result:</h3>
      <p>Total Score: {quizResult.score}</p>
      <p>Correct Answers: {quizResult.correctAnswers}</p>
      <p>Wrong Answers: {quizResult.wrongAnswers}</p>
      <p>Percentage: {percentage.toFixed(2)}%</p>
      <p>Status: {status}</p>

      {/* Review Questions Section */}
      <h4 className="mt-4 text-lg font-bold">Review Questions:</h4>
      <ul>
        {questions.map((q, idx) => (
          <li key={idx} className="mb-2 p-3 border rounded-md">
            <p><strong>Q{idx + 1}: {q.question}</strong></p>
            <p className="text-green-600">Correct Answer: {q.correctAnswer}</p>
          </li>
        ))}
      </ul>

      {/* Restart Button */}
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4 hover:bg-blue-700"
      >
        Restart
      </button>
    </div>
  );
};

export default ScoreCard;
