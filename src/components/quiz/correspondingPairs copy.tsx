import React, { useState, useMemo } from "react";
import { QuestionType, AnswerType } from "@/lib/types";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { scoreStateAtom } from "@/store/data";

const pairColors = [
  "bg-pink-200",
  "bg-purple-200",
  "bg-indigo-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-orange-200",
  "bg-red-200",
];

export default function CorrespondingPairsQuiz({
  question,
  answers,
}: {
  question: QuestionType;
  answers: AnswerType[];
}) {
  const [score, setScore] = useRecoilState(scoreStateAtom);
  const [selectedPairs, setSelectedPairs] = useState<Record<string, string>>(
    {}
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [firstSelection, setFirstSelection] = useState<string | null>(null);

  const columnB = answers.filter((answer) => answer?.pair?.startsWith("A"));
  const columnA = answers.filter((answer) => answer?.pair?.startsWith("B"));

  const pairColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(selectedPairs).forEach(([key, value], index) => {
      map[key] = pairColors[index % pairColors.length];
      map[value] = pairColors[index % pairColors.length];
    });
    return map;
  }, [selectedPairs]);

  console.log({columnA, columnB})

  const handleSelection = (id: string, isColumnA: boolean) => {
    if (isSubmitted) return;

    if (isColumnA) {
      if (firstSelection) {
        // If there's already a first selection, clear it
        setSelectedPairs((prev) => {
          const newPairs = { ...prev };
          delete newPairs[firstSelection];
          return newPairs;
        });
      }
      setFirstSelection(id);
    } else {
      if (firstSelection) {
        // Complete the pair
        setSelectedPairs((prev) => ({
          ...prev,
          [firstSelection]: id,
        }));
        setFirstSelection(null);
      } else {
        // If clicking on column B first, do nothing
        return;
      }
    }
  };

  const handleSubmit = () => {
    if (Object.keys(selectedPairs).length !== columnA.length) {
      alert("Please match all items before submitting.");
      return;
    }

    let allPairsCorrect = true;
    Object.entries(selectedPairs).forEach(([columnAId, columnBId]) => {
      const itemA = answers.find(
        (answer: AnswerType) => answer.id?.toString() === columnAId
      );
      const itemB = answers.find(
        (answer: AnswerType) => answer.id === columnBId
      );
      // Ensure both items exist and their pairs match
      if (!itemA || !itemB) {
        allPairsCorrect = false; // If either item doesn't exist, mark as incorrect
      } else if (itemA.pair !== itemB.pair) {
        allPairsCorrect = true; // Check if pairs match
      }

      console.log({
        selectedPairs: Object.entries(selectedPairs),
        itemA,
        itemB,
        allPairsCorrect
      });
    });

    if (allPairsCorrect) {
      setScore(score + 1);
      setAllCorrect(true);
    } else {
      setAllCorrect(false);
    }

    //setIsSubmitted(true);
  };

  const isCorrectPair = (answerId: string) => {
    //if (!isSubmitted) return false;
    const pairedId = Object.entries(selectedPairs).find(
      ([key, value]) => key === answerId || value === answerId
    )?.[1];
    const answer = answers.find((a) => a.id === answerId);
    const pairedAnswer = answers.find((a) => a.id === pairedId);
    return answer?.pair === pairedAnswer?.pair;
  };

  return (
    <React.Fragment>
      <h2 className="text-2xl font-bold mb-4 text-center break-words text-white w-full">
        {question && question.text}
      </h2>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          {columnA.map((answer) => (
            <motion.div
              key={answer.id}
              whileHover={{ scale: 1.05 }}
              className={`cursor-pointer rounded-lg p-3 border-2 text-black font-bold 
                ${
                  isSubmitted
                    ? isCorrectPair(answer.id!)
                      ? "bg-green-500"
                      : "bg-red-500"
                    : firstSelection === answer.id
                    ? "bg-yellow-300"
                    : pairColorMap[answer.id!] || "bg-white"
                }`}
              onClick={() => handleSelection(answer.id!, true)}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-light/30 text-2xl w-12 h-12 flex items-center justify-center">
                  {answer.pair}
                </div>
                <span>{answer.text}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="space-y-4">
          {columnB.map((answer) => (
            <motion.div
              key={answer.id}
              whileHover={{ scale: 1.05 }}
              className={`cursor-pointer rounded-lg p-3 border-2 text-black font-bold 
                ${
                  isSubmitted
                    ? isCorrectPair(answer.id!)
                      ? "bg-green-500"
                      : "bg-red-500"
                    : firstSelection &&
                      !Object.values(selectedPairs).includes(answer.id!)
                    ? "bg-blue-300"
                    : pairColorMap[answer.id!] || "bg-white"
                }`}
              onClick={() => handleSelection(answer.id!, false)}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-light/30 text-2xl w-12 h-12 flex items-center justify-center">
                  {answer.pair}
                </div>
                <span>{answer.text}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={handleSubmit}
          disabled={isSubmitted}
        >
          Submit Answers
        </motion.button>
        {isSubmitted && (
          <div
            className={`text-lg font-semibold ${
              allCorrect ? "text-green-500" : "text-red-500"
            }`}
          >
            {allCorrect
              ? "Congratulations! All pairs are correct. You earned 1 point!"
              : "Some pairs are incorrect. No points earned. Try again!"}
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
