// Quiz.tsx
import React, { useState, useEffect } from "react";
import { fetchQuizQuestions } from "../Data/QuestionSet";
import ScoreCard from "./ScoreCard";
import { QuizProps, QuizResult, Question } from "../Interfaces/quiz-app";
import { db } from "../firebaseConfig"; 
import { doc, setDoc } from "firebase/firestore"; 
import { getAuth } from "firebase/auth"; 

const apiKey = "7rMiISBZzbhex1iApiNjLS7bDcH31KV1g5s8kLXl";

const Quiz: React.FC<QuizProps> = ({ name, numQuestions, finishQuiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<QuizResult>({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timer, setTimer] = useState<number>(numQuestions * 30);

  useEffect(() => {
    const loadQuestions = async () => {
      const fetchedQuestions = await fetchQuizQuestions(apiKey, numQuestions, "Linux", "Medium");
      setQuestions(fetchedQuestions);
    };
    loadQuestions();
  }, [numQuestions]);

  useEffect(() => {
    if (timer > 0 && !showResults) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      handleAutoSubmit();
    }
  }, [timer, showResults]);

  if (questions.length === 0) return <p>Loading questions...</p>;

  const { question, answers, correctAnswer } = questions[currentQuestionIndex];

  const onAnswerSelected = (answer: string, idx: number) => {
    setSelectedAnswerIndex(idx);
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === correctAnswer) {
      setQuizResult((prev) => ({
        ...prev,
        score: prev.score + 5,
        correctAnswers: prev.correctAnswers + 1,
      }));
    } else {
      setQuizResult((prev) => ({
        ...prev,
        wrongAnswers: prev.wrongAnswers + 1,
      }));
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleAutoSubmit();
    }

    setSelectedAnswer("");
    setSelectedAnswerIndex(null);
  };

  const handleAutoSubmit = () => {
    setShowResults(true);
    finishQuiz();
    saveQuizResultsToFirestore();
  };

  const saveQuizResultsToFirestore = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const resultData = {
        userId: user.uid,
        name,
        score: quizResult.score,
        correctAnswers: quizResult.correctAnswers,
        wrongAnswers: quizResult.wrongAnswers,
        percentage: (quizResult.score / (questions.length * 5)) * 100,
        date: new Date(),
      };

      await setDoc(doc(db, "quizResults", user.uid), resultData);
    } catch (error) {
      console.error("Error saving quiz results: ", error);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      {!showResults ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h4 className="text-lg font-semibold">{question}</h4>
          <ul className="list-none">
            {answers.map((answer, idx) => (
              <li
                key={idx}
                onClick={() => onAnswerSelected(answer, idx)}
                className={`p-3 mb-2 border rounded-md cursor-pointer hover:bg-gray-100 ${
                  selectedAnswerIndex === idx ? "bg-blue-500 text-white" : ""
                }`}
              >
                {answer}
              </li>
            ))}
          </ul>
          <button
            onClick={handleNextQuestion}
            className="bg-blue-600 text-white py-2 px-4 rounded-md"
            disabled={!selectedAnswer}
          >
            {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next Question"}
          </button>
        </div>
      ) : (
        <ScoreCard quizResult={quizResult} questions={questions} name={name} />
      )}
    </div>
  );
};

export default Quiz;