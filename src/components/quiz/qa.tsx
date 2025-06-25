"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { ArrowDownIcon } from "@/assets/icons/arrow-down";
import { useGetModule, useListModules } from "@/data/module";
import { useParams } from "next/navigation";
import Image from "next/image";
import { TranslatedText } from "../game/shared/translatedUI";
import { useRecoilState, useRecoilValue } from "recoil";
import { gameOverAtom, languageStateAtom } from "@/store/data";

type Question = {
  id: string;
  text: string;
  answers: string[];
  correctAnswer: string;
};

const questions: Question[] = [
  {
    id: "q1",
    text: "What is the capital of France?",
    answers: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "2",
  },
  {
    id: "q4",
    text: "What is the best man on earth?",
    answers: ["Elvis", "Bartolomeu", "Barrao", "Tiago"],
    correctAnswer: "3",
  },
  {
    id: "q2",
    text: "Which planet is known as the Red Planet?",
    answers: ["Mars", "Venus", "Jupiter", "Saturn"],
    correctAnswer: "0",
  },
  {
    id: "q3",
    text: "What is the largest mammal in the world?",
    answers: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: "1",
  },
];

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameOver, setGameOver] = useRecoilState(gameOverAtom);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const language = useRecoilValue(languageStateAtom);

  const { quizId } = useParams();

  const { data: quiz, isLoading, error } = useGetModule(quizId as string);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      handleNextQuestion();
    }
  }, [timeLeft, gameOver]);

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
    if (
      questions[currentQuestionIndex]?.answers?.findIndex(
        (ans) => ans === answer
      ) === parseInt(questions[currentQuestionIndex].correctAnswer)
    ) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(10);
      setSelectedAnswer(null);
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(10);
    setGameOver(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="flex gap-10 items-center justify-center min-h-screen bg-gradient-to-b from-purple-400 to-pink-500 p-4 w-full">
      <Card className="w-full max-w-2xl rounded-lg border-none shadow-none">
        <CardContent className="p-6">
          {!gameOver ? (
            <div className="flex flex-col items-center gap-12 w-full">
              <div className="w-full flex flex-col gap-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold">Score: {score}</div>
                  <div className="text-2xl font-bold">Time: {timeLeft}s</div>
                </div>
                <Progress
                  value={(currentQuestionIndex / questions.length) * 100}
                  className="mb-4"
                />
                <h2 className="text-2xl font-bold mb-4 text-center">
                  {questions[currentQuestionIndex].text}
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {questions[currentQuestionIndex].answers.map((answer) => (
                    <motion.button
                      key={answer}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={` rounded-full h-12 border-2 border-blue-300 text-white font-bold ${
                        selectedAnswer === answer
                          ? questions[currentQuestionIndex]?.answers?.findIndex(
                              (ans) => ans === answer
                            ) ===
                            parseInt(
                              questions[currentQuestionIndex].correctAnswer
                            ) -
                              1
                            ? "bg-green-500"
                            : "bg-red-500"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                      onClick={() => handleAnswerClick(answer)}
                      disabled={selectedAnswer !== null}
                    >
                      {answer}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div className="w-full flex items-center justify-center ">
                <motion.button
                  // style={{ filter: shadow }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextQuestion}
                  className="mt-10 p-4 text-white bg-yellow-700 w-fit h-fit rounded-full cursor-pointer disabled:cursor-not-allowed"
                  disabled={selectedAnswer === null}
                >
                  <ArrowDownIcon />
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
              <p className="text-xl mb-4">
                <TranslatedText textKey="score" language={language} />: {score}/
                {questions.length}
              </p>
              <Button onClick={resetGame} className="w-full">
                <TranslatedText textKey="playagain" language={language} />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
