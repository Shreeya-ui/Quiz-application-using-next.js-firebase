import { Quiz, Question } from "../Interfaces/quiz-app";

// Function to fetch quiz questions from the API
export const fetchQuizQuestions = async (
  apiKey: string,
  limit: number = 10,
  category: string = "Linux",
  difficulty: string = "Medium"
): Promise<Question[]> => {
  try {
    const response = await fetch(
      `https://quizapi.io/api/v1/questions?apiKey=${apiKey}&limit=${limit}&category=${category}&difficulty=${difficulty}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch quiz questions: ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Unexpected API response format.");
    }

    // Map the API response to your expected format
    return data.slice(0, limit).map((item, index) => ({
      id: item.id || index + 1,
      question: item.question || "No question available",
      answers: item.answers
        ? Object.values(item.answers).filter((answer): answer is string => typeof answer === "string")
        : [],
      correctAnswer: item.correct_answer || "",
    }));
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return [];
  }
};
