"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { ArrowDownIcon } from "@/assets/icons/arrow-down";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentQuestionIndexAtom,
  gameOverAtom,
  languageStateAtom,
  qaAtom,
  scoreStateAtom,
  selectedAnswerAtom,
} from "@/store/data";
import { useParams, useSearchParams } from "next/navigation";
import { useGetModule } from "@/data/module";
import { useListQuestions } from "@/data/question";
import { useListAnswers } from "@/data/answer";
import { AnswerType } from "@/lib/types";
import { CoinIcon } from "@/assets/icons/coin-icon";
import { TimerIcon } from "@/assets/icons/timer-icon";
import { Redo2, Repeat1, Repeat2, RotateCcw } from "lucide-react";
import Image from "next/image";
import SingleAnswer from "@/components/quiz/singleAnswer";
import DndQuestion from "@/components/quiz/dndAnswer";
import CorrespondingPairs from "@/components/creator/subcomponents/quiztype/correpondingPairs";
import CorrespondingPairsQuiz from "@/components/quiz/correspondingPairs";
import CoEMultipleAnswer from "@/components/creator/subcomponents/quiztype/CoEMultipleAnswer";
import CoESingleAnswer from "@/components/creator/subcomponents/quiztype/CoESingleAnswer";

import PairMatchingGame from "@/components/quiz/correspondingPairs2";
import QuestionStepper from "@/components/quiz/subcomponents/questionstepper";
import { TranslatedText } from "@/components/game/shared/translatedUI";
import Confetti from "react-confetti"; // Import the Confetti component
import QuizSubmission from "@/components/result/resultSubmission";

type Question = {
  id: string;
  text: string;
  answers: string[];
  correctAnswer: string;
};

// const questions: Question[] = [
//   {
//     id: "q1",
//     text: "What is the capital of France?",
//     answers: ["London", "Berlin", "Paris", "Madrid"],
//     correctAnswer: "2",
//   },
//   {
//     id: "q4",
//     text: "What is the best man on earth?",
//     answers: ["Elvis", "Bartolomeu", "Barrao", "Tiago"],
//     correctAnswer: "3",
//   },
//   {
//     id: "q2",
//     text: "Which planet is known as the Red Planet?",
//     answers: ["Mars", "Venus", "Jupiter", "Saturn"],
//     correctAnswer: "0",
//   },
//   {
//     id: "q3",
//     text: "What is the largest mammal in the world?",
//     answers: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
//     correctAnswer: "1",
//   },
// ];

export default function Page() {
  // const [questions, setQuestions] = useRecoilState<Question[]>(qaAtom);
  const clockSoundRef = useRef<HTMLAudioElement | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useRecoilState(
    currentQuestionIndexAtom
  );
  // const [score, setScore] = useState(0);
  const [score, setScore] = useRecoilState(scoreStateAtom);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [gameOver, setGameOver] = useRecoilState(gameOverAtom);
  const [selectedAnswer, setSelectedAnswer] = useRecoilState<AnswerType | null>(
    selectedAnswerAtom
  );
  const language = useRecoilValue(languageStateAtom);

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const { quizId } = useParams();

  const { data: quiz, isLoading, error } = useGetModule(quizId as string);
  const {
    data: questions,
    isLoading: isLoadingQuestions,
    error: errorQuestions,
  } = useListQuestions(quizId as string);

  const {
    data: answers,
    isLoading: isLoadingAnswers,
    error: errorAnswers,
  } = useListAnswers(questions?.[currentQuestionIndex]?.id as string);

 

  useEffect(() => {
    if (quiz?.time_limit && timeLeft === null) {
      // Convert minutes to seconds
      setTimeLeft(quiz.time_limit * 60);
    }
  }, [quiz, timeLeft]);

  // useEffect(() => {
  //   if (timeLeft !== null && timeLeft > 0 && !gameOver) {
  //     const timer = setTimeout(() => {
  //       setTimeLeft(timeLeft - 1);
  //       clockSoundRef.current?.play();
  //     }, 1000);
  //     return () => {
  //       clearTimeout(timer);
  //       if (clockSoundRef.current) {
  //         clockSoundRef.current.pause();
  //         clockSoundRef.current.currentTime = 0;
  //       }
  //     };
  //   } else if (timeLeft === 0 && !gameOver) {
  //     setGameOver(true);
  //   }
  // }, [timeLeft, gameOver]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // setTimeLeft(10);
      setSelectedAnswer(null);
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(quiz?.time_limit && quiz ? quiz.time_limit * 60 : 120000);
    setGameOver(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="flex relative items-center justify-center min-h-screen bg-gradient-to-b from-purple-dark to-purple-light p-4 w-full">
      {gameOver && questions && score > questions?.length * 0.7 && <Confetti />}{" "}
      {/* Render confetti if score > 70% */}
      <audio
        ref={(audio) => {
          if (audio) {
            // @ts-ignore
            window.correctSound = audio;
          }
        }}
        src="/sounds/correct-answer.mp3"
      />
      <audio ref={clockSoundRef} src="/sounds/wrong.wav" loop />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3">
        <Image
          src={
            selectedAnswer === null
              ? "/avatar/explainer-2.png"
              : selectedAnswer?.id ===
                answers?.find((answer: any) => answer.isCorrect === 1)?.id
              ? "/avatar/happy-1.png"
              : "/avatar/happy-2.png"
          }
          alt="Quiz Avatar"
          className=" object-contain "
          fill
        />
      </div>
      <Card className="w-full max-w-2xl rounded-lg border-none shadow-none">
        <CardContent className="p-6">
          {!gameOver ? (
            <div className="flex flex-col items-center gap-12 w-full">
              <div className="w-full flex flex-col gap-5">
                <div className="flex justify-end items-center mb-4">
                  {/* <div className="text-2xl font-bold flex items-center gap-2 rounded-full bg-purple-light pr-5 p-2">
                    <TimerIcon /> {timeLeft ? formatTime(timeLeft) : "00:00"}
                  </div> */}
                  <div className="text-2xl font-bold flex items-center gap-2 rounded-full bg-purple-light pr-5 p-2 ">
                    <CoinIcon /> {score}
                  </div>
                </div>
                {/* <div className="flex flex-col gap-5 justify-center items-center">
                  <span className="text-white text-2xl font-bold">
                    {currentQuestionIndex + 1} / {questions?.length}
                  </span>
                  <Progress
                    value={
                      (currentQuestionIndex / (questions?.length || 100)) * 100
                    }
                    className="mb-4 h-2 w-4/6 bg-gray-200 rounded-none"
                  />
                </div> */}

                {/* Render the appropriate answer component based on question type */}
                {/* {questions?.[currentQuestionIndex] && answers && (
                  <>
                    {questions[currentQuestionIndex].type === "single_answer" && (
                      <SingleAnswer
                        question={questions[currentQuestionIndex]}
                        answers={answers}
                      />
                    )}
                    {questions[currentQuestionIndex].type === "multiple_answer" && (
                      <CoEMultipleAnswer
                        question={questions[currentQuestionIndex]}
                        answers={answers}
                      />
                    )}
                    {questions[currentQuestionIndex].type === "dnd" && (
                      <DndQuestion
                        question={questions[currentQuestionIndex]}
                        answers={answers}
                      />
                    )}
                    {questions[currentQuestionIndex].type === "pairs" && (
                      <CorrespondingPairsQuiz
                        question={questions[currentQuestionIndex]}
                        answers={answers}
                      />
                    )}
                  </>
                )} */}
              </div>
              <QuestionStepper
                question={questions?.[currentQuestionIndex]}
                answers={answers}
                onNext={handleNextQuestion}
                onSelectAnswer={setSelectedAnswer}
              />

              {/* <div className="w-full flex items-center justify-end ">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextQuestion}
                  className="p-4 px-8 text-white bg-green font-bold w-fit h-fit rounded-lg cursor-pointer disabled:cursor-not-allowed"
                >
                  Próxima
                </motion.button>
              </div> */}
            </div>
          ) : (
            <div className="text-center flex flex-col gap-7 text-white items-center justify-between h-[90vh] ">
              <div>
                <h2 className="text-3xl font-bold ">
                  <TranslatedText textKey="complete" language={language} />
                </h2>
                <p className="text-xl mb-4 tex-white">
                  <TranslatedText textKey="score" language={language} />:{" "}
                  {score}/{questions?.length || 0}
                </p>
                <Button
                  onClick={resetGame}
                  className="w-1/2 bg-green text-black flex items-center gap-2"
                >
                  <RotateCcw className="hover:-rotate-180 duration-500 " />
                  <TranslatedText textKey="playagain" language={language} />
                </Button>

                <QuizSubmission
                  score={score}
                  totalQuestions={questions?.length || 0}
                />
              </div>
              {/* <div className="px-10 flex w-full justify-between">
                <a
                  href="https://pdconsultacademy.online/moodle/mod/page/view.php?id=1508"
                  //onClick={resetGame}
                  target="_self"
                  className="w-1/2 bg-green text-black flex items-center gap-2"
                >
                  <TranslatedText textKey="nextblock" language={language} />
                </a>
                <a
                  href="https://pdconsultacademy.online/moodle/mod/page/view.php?id=1487"
                  //onClick={resetGame}
                  target="_self"
                  className="w-1/2 bg-green text-black flex items-center gap-2"
                >
                  <TranslatedText textKey="previousblock" language={language} />
                </a>
              </div> */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
