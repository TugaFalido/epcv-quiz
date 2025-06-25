import React, { useEffect } from "react";
import { QuestionType, AnswerType } from "@/lib/types";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import {
  hasAnsweredAtom,
  hasScoredNowAtom,
  scoreStateAtom,
  selectedAnswerAtom,
} from "@/store/data";
import { Button } from "../ui/button";
import { AnswerDescription } from "./info-description";
export default function SingleAnswer({
  question,
  answers,
}: {
  question: QuestionType;
  answers: AnswerType[];
}) {
  const [hasScored, setHasScore] = useRecoilState(hasScoredNowAtom);
  const [selectedAnswer, setSelectedAnswer] = useRecoilState<AnswerType | null>(
    selectedAnswerAtom
  );
  const [hasAnswered, setHAsAnswered] = useRecoilState(hasAnsweredAtom);

  const playBeep = () => {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = 440; // frequency in hertz
    gainNode.gain.value = 0.3; // volume

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1); // duration in seconds
  };

  useEffect(() => {
    const initAnswered = () => {
      setHAsAnswered(false);
    };
    initAnswered();
  }, []);

  const handleAnswerClick = (answer: AnswerType) => {
    playBeep();
    setSelectedAnswer(answer);

    if (
      answer?.isCorrect ===
      answers?.find((answer) => answer.isCorrect === 1)?.isCorrect
    ) {
      //setScore(score + 1);
      setHasScore(true);
    } else {
      setHasScore(false);
    }

    setHAsAnswered(true);
  };

  return (
    <React.Fragment>
      <h2 className="text-lg lg:text-2xl font-bold mb-4 text-center break-words  text-white w-full">
        {question && question.text}
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {answers &&
          answers.map((answer: AnswerType, index: number) => (
            <motion.button
              key={answer?.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer rounded-lg h-fit p-3 items-center border-2  text-black font-bold flex md:gap-5 gap-2 text-xs md:text-lg justify-between ${
                selectedAnswer?.id === answer?.id ? "bg-blue-400" : "bg-white"
              }`}
              onClick={() => handleAnswerClick(answer)}
              //disabled={selectedAnswer !== null}
            >
              <div className="flex md:gap-5 gap-2">
                <div className="rounded-full bg-purple-light/30 text-sm md:text-lg md:w-10 md:h-10 w-8 h-8 min-w-8 md:min-w-10 flex items-center justify-center text-center">
                  {String.fromCharCode(65 + index)}
                </div>
                {answer?.text}
              </div>
              {answer?.info && answer?.info !== "" && (
                <AnswerDescription info={answer?.info} />
              )}
            </motion.button>
          ))}
      </div>
    </React.Fragment>
  );
}
