import React, { useState, useEffect } from "react";
import { QuestionType, AnswerType } from "@/lib/types";
import { motion } from "framer-motion";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  hasAnsweredAtom,
  hasScoredNowAtom,
  languageStateAtom,
  scoreStateAtom,
} from "@/store/data";
import Image from "next/image";
import { TranslatedText } from "../game/shared/translatedUI";
import { Button } from "../ui/button";

const pairColors = [
  "bg-green",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-purple-light",
  "bg-red-500",
];

interface Pair {
  fromA: AnswerType;
  toB: AnswerType;
  color: string;
}

export default function CorrespondingPairsQuiz({
  question,
  answers,
  setUserPairings,
}: {
  question: QuestionType;
  answers: AnswerType[];
  setUserPairings: (newPairs: any) => void;
}) {
  const [selectedFromA, setSelectedFromA] = useState<AnswerType | null>(null);
  const [pairings, setPairings] = useState<Pair[]>([]);
  const [disabledPairs, setDisabledPairs] = useState<string[]>([]);
  const [shuffledAnswersA, setShuffledAnswersA] = useState<AnswerType[]>([]);
  const [shuffledAnswersB, setShuffledAnswersB] = useState<AnswerType[]>([]);
  const [score, setScore] = useRecoilState(scoreStateAtom);
  const language = useRecoilValue(languageStateAtom);
  const [hasScored, setHasScored] = useRecoilState(hasScoredNowAtom);
  const [showGif, setShowGif] = useState<boolean>(true); // State for showing GIF

  const [hasAnswered, setHAsAnswered] = useRecoilState(hasAnsweredAtom);

  useEffect(() => {
    const answersA = answers.filter((item) => item.pair?.startsWith("A"));
    const answersB = answers.filter((item) => item.pair?.startsWith("B"));
    setShuffledAnswersA(shuffleArray(answersA));
    setShuffledAnswersB(shuffleArray(answersB));
    setHAsAnswered(false)

    // Set timer to hide the GIF after 15 seconds
  }, [answers]);

  const shuffleArray = (array: AnswerType[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

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

  const handleSelectFromA = (item: AnswerType) => {
    if (item.id && !disabledPairs.includes(item.id)) {
      setSelectedFromA(item);
      playBeep();
    }
  };

  const handleSelectFromB = (item: AnswerType) => {
    if (
      item.id &&
      !disabledPairs.includes(item.id) &&
      selectedFromA &&
      selectedFromA.id
    ) {
      const color = pairColors[pairings.length % pairColors.length];
      const newPair: Pair = { fromA: selectedFromA, toB: item, color };
      setPairings((prevPairings) => [...prevPairings, newPair]);
      setDisabledPairs((prevDisabled) => [
        ...prevDisabled,
        selectedFromA.id!,
        item.id!,
      ]);
      setSelectedFromA(null);

      if (pairings.length + 1 === answers.length / 2) {
        checkPairs();
        setUserPairings(pairings);
      }
    }
  };

  const checkPairs = () => {
    let allCorrect = true;
    pairings.forEach((pair) => {
      console.log({ pair });
      if (pair.fromA.pair?.replace("A", "B") !== pair.toB.pair) {
        allCorrect = false;
      }
    });

    setHAsAnswered(true);

    if (allCorrect) {
      //setScore((prevScore: any) => prevScore + 1);
      setHasScored(true);
    }
  };

  const retryPairs = () => {
    setPairings([]);
    setDisabledPairs([]);
    setSelectedFromA(null);
    setShuffledAnswersA(shuffleArray(shuffledAnswersA));
    setShuffledAnswersB(shuffleArray(shuffledAnswersB));
    setHAsAnswered(false);

    if (hasScored) {
      setScore(score - 1);
      setHasScored(false);
    }
  };

  const getItemStyle = (item: AnswerType, isColumnA: boolean) => {
    const pair = pairings.find(
      (p) => (isColumnA ? p.fromA.id : p.toB.id) === item.id
    );
    if (pair) {
      return pair.color;
    }
    if (isColumnA && selectedFromA?.id === item.id) {
      return "bg-cyan-300";
    }
    return "bg-white";
  };

  return (
    <React.Fragment>
      <h2 className="lg:text-xl text-md font-bold mb-4 text-center break-words text-white w-full">
        {question && question.text}
      </h2>
      <div className="flex flex-col gap-10 ">
        <div className="flex justify-between w-full gap-10">
          {/* Column A */}
          <div className="flex flex-col gap-3 w-1/2">
            {shuffledAnswersA.map((item, index) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                animate={disabledPairs.includes(item.id!) ? { x: 20 } : {}}
                className={`cursor-pointer rounded-lg p-3 border-2 text-black font-bold w-full ${getItemStyle(
                  item,
                  true
                )}`}
                onClick={() => handleSelectFromA(item)}
              >
                <div className="flex items-center gap-3 w-full text-xs lg:text-lg">
                  <div className="rounded-full bg-purple-light/30 md:text-md lg:text-lg text-sm w-5 h-5 md:w-8 md:h-8 p-4 flex items-center justify-center">
                    {index + 1}
                  </div>
                  {`${item.text} `}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Column B */}
          <div className="flex flex-col gap-3 w-1/2">
            {shuffledAnswersB.map((item, index) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                animate={disabledPairs.includes(item.id!) ? { x: -20 } : {}}
                className={`cursor-pointer rounded-lg p-3 border-2 text-black font-bold w-full ${getItemStyle(
                  item,
                  false
                )}`}
                onClick={() => handleSelectFromB(item)}
              >
                <div className="flex  gap-3">
                  <div className="rounded-full bg-purple-light/30 md:text-md lg:text-lg text-sm w-5 h-5 md:w-8 md:h-8 p-4 flex items-center justify-center">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="break-words text-xs lg:text-lg">
                    {item.text}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col w-full items-end">
          <Button
            onClick={retryPairs}
            className=" px-5 bg-blue-500 text-white py-1 rounded-lg font-bold text-sm lg:text-lg"
          >
            <TranslatedText textKey="undo" language={language} />
          </Button>
        </div>
      </div>
      {/* GIF component */}
    </React.Fragment>
  );
}
