"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuestionType, AnswerType } from "@/lib/types"; // Import types
import { hasAnsweredAtom, hasScoredNowAtom, languageStateAtom } from "@/store/data";
import { useRecoilState, useRecoilValue } from "recoil";
import { TranslatedText } from "../game/shared/translatedUI";

export default function DndQuestion({
  question,
  answers,
}: {
  question: QuestionType;
  answers: AnswerType[];
}) {
  const [playerAnswer, setPlayerAnswer] = useState<(string | null)[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasScored, setHasScore] = useRecoilState(hasScoredNowAtom);
  const [hasAnswered, setHAsAnswered] = useRecoilState(hasAnsweredAtom);
  const language = useRecoilValue(languageStateAtom);

  // Count the number of blank spaces in the question
  const blankCount = (question.text.match(/\[blank\]/g) || []).length;

  useEffect(() => {
    // Initialize playerAnswer with nulls based on the number of blanks in the question
    setPlayerAnswer(new Array(blankCount).fill(null));
    // Set available words from the answers array
    setAvailableWords(
      answers.map((answer) => answer.text).sort(() => Math.random() - 0.5)
    );
  }, [question, answers, blankCount]);

  const onWordClick = (word: string) => {
    // Check if the maximum number of words has been selected
    if (playerAnswer.every((answer) => answer !== null)) {
      return; // Do not allow further selections
    }

    const nextEmptyIndex = playerAnswer.findIndex((answer) => answer === null);
    if (nextEmptyIndex !== -1) {
      setPlayerAnswer((answer) => {
        const newAnswer = [...answer];
        newAnswer[nextEmptyIndex] = word;
        return newAnswer;
      });
      setAvailableWords((words) => words.filter((w) => w !== word));
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      source.droppableId === "words" &&
      destination.droppableId.startsWith("blank-")
    ) {
      const wordIndex = source.index;
      const blankIndex = parseInt(destination.droppableId.split("-")[1]);

      setAvailableWords((words) =>
        words.filter((_, index) => index !== wordIndex)
      );
      setPlayerAnswer((answer) => {
        const newAnswer = [...answer];
        newAnswer[blankIndex] = availableWords[wordIndex];
        return newAnswer;
      });
    } else if (
      source.droppableId.startsWith("blank-") &&
      destination.droppableId === "words"
    ) {
      const blankIndex = parseInt(source.droppableId.split("-")[1]);
      const word = playerAnswer[blankIndex];

      setPlayerAnswer((answer) => {
        const newAnswer = [...answer];
        newAnswer[blankIndex] = null;
        return newAnswer;
      });
      setAvailableWords((words) => [...words, word!]);
    }
  };

  const checkAnswer = () => {
    const isCorrect = answers.every((answer, index) => {
      return answer.isCorrect === 1
        ? playerAnswer[index] === answer.text
        : true;
    });
    setIsCorrect(isCorrect);
  };

  const resetGame = () => {
    setPlayerAnswer(new Array(blankCount).fill(null));
    setAvailableWords(
      answers.map((answer) => answer.text).sort(() => Math.random() - 0.5)
    );
    setIsCorrect(null);
  };

  const removeWord = (index: number) => {
    const wordToRemove = playerAnswer[index];
    if (wordToRemove) {
      setPlayerAnswer((answer) => {
        const newAnswer = [...answer];
        newAnswer[index] = null; // Clear the answer
        return newAnswer;
      });
      setAvailableWords((words) => [...words, wordToRemove]); // Add back to available words
    }
  };

  return (
    <div className=" mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto border-none text-white">
        <CardHeader>
          <CardTitle>
            {/* <TranslatedText textKey="dndtitle" language={language} /> */}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-10">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="mb-6 md:text-xl text-lg">
              {question.text
                .split(/(\[blank\])/)
                .map((part: any, index: number) =>
                  part === "[blank]" ? (
                    <Droppable
                      key={index}
                      droppableId={`blank-${(index - 1) / 2}`}
                    >
                      {(provided, snapshot) => (
                        <span
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`inline-block w-fit min-w-36 h-8 mx-1 border-b-2 border-dashed `}
                        >
                          {playerAnswer[(index - 1) / 2] ? (
                            <motion.span
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              className="bg-white rounded shadow relative w-full h-fit flex items-center justify-center text-black"
                            >
                              {playerAnswer[(index - 1) / 2]}
                              <button
                                onClick={() => removeWord((index - 1) / 2)} // Remove word on click
                                className="absolute -top-1 -right-1 text-white bg-red-400 cursor-pointer rounded-full text-xs px-1"
                              >
                                X
                              </button>
                            </motion.span>
                          ) : (
                            <span className="text-gray-400 w-36 min-w-36 border-white">
                              {" "}
                            </span>
                          )}
                          {provided.placeholder}
                        </span>
                      )}
                    </Droppable>
                  ) : (
                    <span key={index}>{part}</span>
                  )
                )}
            </div>
            <Droppable droppableId="words" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-wrap gap-2 mb-6 min-h-[40px] items-center text-xs md:text-lg"
                >
                  <div className="flex flex-row w-full gap-5 items-center justify-center">
                    {availableWords.map((word, index) => (
                      <div
                        key={word}
                        onClick={() => {
                          // Only allow clicking if there are empty spaces
                          if (playerAnswer.includes(null)) {
                            onWordClick(word);
                          }
                        }}
                        className={`px-5 py-3 bg-white text-black rounded cursor-pointer ${
                          playerAnswer.every((answer) => answer !== null)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {word}
                      </div>
                    ))}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {/* <Button onClick={resetGame} variant="outline">
            Reset
          </Button> */}
          {/* Ordered list of selected answers */}
          {/* <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Your Answers:</h3>
            <ol className="list-decimal pl-6">
              {playerAnswer.map((answer, index) => (
                <li key={index}>{answer || "Not answered"}</li>
              ))}
            </ol>
          </div>
          <div className="flex justify-between">
            <Button
              onClick={checkAnswer}
              disabled={playerAnswer.includes(null)}
            >
              Check Answer
            </Button>
            
          </div> */}
          {/* {isCorrect !== null && (
            <div
              className={`mt-4 p-2 rounded ${
                isCorrect
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isCorrect
                ? "Correct! Well done!"
                : "Not quite right. Try again!"}
            </div>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
}
