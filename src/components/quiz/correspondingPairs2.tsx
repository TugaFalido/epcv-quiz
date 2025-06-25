import React, { useState } from "react";
import { motion } from "framer-motion";

interface Answer {
  id: string;
  text: string;
  isCorrect: number;
  question_id: string;
  pair: string;
  correct_order: number;
}

interface Pair {
  fromA: Answer;
  toB: Answer;
  color: string; // Color associated with the pair
}

// Define a list of colors to be used for each pair
const pairColors = ["bg-green", "bg-blue-500", "bg-yellow-500", "bg-purple-500", "bg-red-500"];

const answers: Answer[] = [
  {
    id: "1",
    text: "Answer A1 Answer A1 Answer A1 Answer A1",
    isCorrect: 0,
    question_id: "q1",
    pair: "A1",
    correct_order: 0,
  },
  {
    id: "2",
    text: "Answer B1 Answer A1 Answer A1 Answer A1",
    isCorrect: 0,
    question_id: "q1",
    pair: "B1",
    correct_order: 0,
  },
  {
    id: "3",
    text: "Answer A2 Answer A1 Answer A1 Answer A1",
    isCorrect: 0,
    question_id: "q1",
    pair: "A2",
    correct_order: 0,
  },
  {
    id: "4",
    text: "Answer B2 Answer A1 Answer A1 Answer A1",
    isCorrect: 0,
    question_id: "q1",
    pair: "B2",
    correct_order: 0,
  },
];

const PairMatchingGame: React.FC = () => {
  const [selectedFromA, setSelectedFromA] = useState<Answer | null>(null);
  const [pairings, setPairings] = useState<Pair[]>([]);
  const [disabledPairs, setDisabledPairs] = useState<string[]>([]);

  const handleSelectFromA = (item: Answer) => {
    if (!disabledPairs.includes(item.id)) {
      setSelectedFromA(item);
    }
  };

  const handleSelectFromB = (item: Answer) => {
    if (!disabledPairs.includes(item.id) && selectedFromA) {
      const color = pairColors[pairings.length % pairColors.length]; // Get the next color for the pair
      const newPair: Pair = { fromA: selectedFromA, toB: item, color };
      setPairings((prevPairings) => [...prevPairings, newPair]);
      setDisabledPairs((prevDisabled) => [
        ...prevDisabled,
        selectedFromA.id,
        item.id,
      ]); // Disable both items
      setSelectedFromA(null); // Reset after pairing
    }
  };

  const checkPairs = () => {
    let correct = 0;
    pairings.forEach((pair) => {
      if (pair.fromA.pair.replace("A", "B") === pair.toB.pair) {
        correct += 1;
      }
    });
    alert(`You got ${correct} correct pairs out of ${answers.length / 2}`);
  };

  const retryPairs = () => {
    setPairings([]);
    setDisabledPairs([]); // Reset the disabled pairs
    setSelectedFromA(null); // Reset selection
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between w-full gap-10">
        {/* Column A */}
        <div className="flex flex-col gap-5">
          {answers
            .filter((item) => item.pair.startsWith("A"))
            .map((item) => {
              const pair = pairings.find((pair) => pair.fromA.id === item.id);
              const colorClass = pair ? pair.color : "bg-white";

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  animate={disabledPairs.includes(item.id) ? { x: 20 } : {}}
                  className={`cursor-pointer rounded-lg p-3 border-2 text-black font-bold ${selectedFromA?.id === item.id ? "bg-cyan-300" : ""} ${colorClass}`}
                  onClick={() => handleSelectFromA(item)}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-purple-light/30 text-2xl w-12 h-12 flex items-center justify-center">
                      {item.pair}
                    </div>
                    <span className="break-words">{item.text}</span> {/* Text wrapping */}
                  </div>
                </motion.div>
              );
            })}
        </div>

        {/* Column B */}
        <div className="flex flex-col gap-5">
          {answers
            .filter((item) => item.pair.startsWith("B"))
            .map((item) => {
              const pair = pairings.find((pair) => pair.toB.id === item.id);
              const colorClass = pair ? pair.color : "bg-white";

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  animate={disabledPairs.includes(item.id) ? { x: -20 } : {}}
                  className={`cursor-pointer rounded-lg p-3 border-2 text-black font-bold ${colorClass}`}
                  onClick={() => handleSelectFromB(item)}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-purple-light/30 text-2xl w-12 h-12 flex items-center justify-center">
                      {item.pair}
                    </div>
                    <span className="break-words">{item.text}</span> {/* Text wrapping */}
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <button onClick={retryPairs} className="mt-10 bg-blue-500 text-white p-2 rounded-lg">
          Retry
        </button>
      </div>
    </div>
  );
};

export default PairMatchingGame;