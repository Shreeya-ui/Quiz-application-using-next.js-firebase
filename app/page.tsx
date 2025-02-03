"use client";
import { useState, useEffect } from "react";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig";
import Quiz from "./Component/Quiz";
import { User } from "firebase/auth";

export default function Home() {
  const [quizStarted, setQuizStarted] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("quizInProgress") === "true";
    }
    return false;
  });
  
  const [name, setName] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("quizCompleted") === "true";
    }
    return false;
  });

  const [score, setScore] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("quizScore")
        ? Number(localStorage.getItem("quizScore"))
        : null;
    }
    return null;
  });

  // Validate Email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate Password
  const validatePassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  // Google Sign-In
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  // Email/Password Registration
  const handleRegister = async () => {
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Invalid email format. Example: user@example.com");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);
    } catch (error) {
      console.error("Error registering: ", error);
    }
  };

  // Google Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setName("");
      localStorage.removeItem("quizInProgress");
      localStorage.removeItem("quizCompleted");
      localStorage.removeItem("quizScore");
      setScore(null);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setName(currentUser?.displayName || "");
    });
    return () => unsubscribe();
  }, []);

  // Start quiz and enter full screen
  const startQuiz = () => {
    setQuizStarted(true);
    setScore(null);
    localStorage.setItem("quizInProgress", "true");
    localStorage.removeItem("quizScore");

    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }

    window.addEventListener("beforeunload", confirmExit);
  };

  const confirmExit = (event: { preventDefault: () => void; returnValue: string }) => {
    event.preventDefault();
    event.returnValue = "Are you sure you want to exit? Your progress will be lost.";
  };

  useEffect(() => {
    if (quizCompleted) {
      setQuizStarted(false);
    }
  }, [quizCompleted]);

  const finishQuiz = (finalScore: number) => {
    setQuizCompleted(true);
    setScore(finalScore);
    localStorage.setItem("quizCompleted", "true");
    localStorage.setItem("quizScore", String(finalScore));
  };

  return (
    <div className="container mx-auto mt-10 text-center">
      <h1 className="text-green-600 text-3xl font-bold mb-4">Quizi</h1>
      <h3 className="text-xl mb-6">Quiz App</h3>

      {user ? (
        <>
          <p className="mb-2">Welcome, {user.displayName || "User"}!</p>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mb-4"
          >
            Logout
          </button>

          {quizCompleted ? (
            <div>
              <h2 className="text-2xl font-bold text-red-600">Quiz Completed!</h2>
              {score !== null ? (
                <p className="text-lg font-bold">Your Score: {score} / {numQuestions}</p>
              ) : (
                <p>Your results have been saved.</p>
              )}
            </div>
          ) : !quizStarted ? (
            <div>
              <label className="block mb-2">Select Number of Questions:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="border px-2 py-1 mb-4"
              />
              <button
                onClick={startQuiz}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Start Quiz
              </button>
            </div>
          ) : (
            <Quiz name={name} numQuestions={numQuestions} finishQuiz={finishQuiz} />
          )}
        </>
      ) : (
        <div>
          <button
            onClick={handleGoogleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-4"
          >
            Login with Google
          </button>
          <h3 className="text-xl mb-4">Register</h3>
          <input
            type="email"
            placeholder="Email"
            className="block w-full px-4 py-2 border mb-2"
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="text-red-500">{emailError}</p>}

          <input
            type="password"
            placeholder="Password"
            className="block w-full px-4 py-2 border mb-2"
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="text-red-500">{passwordError}</p>}

          <button
            onClick={handleRegister}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
}
