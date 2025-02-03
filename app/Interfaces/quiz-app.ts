export interface Question {
    id: number;
    question: string;
    answers: string[];
    correctAnswer: string;
}

export interface Quiz {
    questions: Question[];
}

export interface QuizResult {
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
}

export interface ScoreCardProps {
    quizResult: QuizResult;
    questions: Question[];
    name: string;
}

export interface QuizProps {
    name: string;
    numQuestions: number;
    finishQuiz: (finalScore: number) => void;
}