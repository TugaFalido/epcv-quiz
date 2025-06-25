"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AnswerType, QuestionType } from "@/lib/types";
import { useListQuestionDescriptionsByQuestionId } from "@/data/question-descriptions";
import SingleAnswer from "@/components/quiz/singleAnswer";
import DndQuestion from "@/components/quiz/dndAnswer";
import CorrespondingPairsQuiz from "@/components/quiz/correspondingPairs";
import CoEMultipleAnswer from "@/components/creator/subcomponents/quiztype/CoEMultipleAnswer";
import { motion } from "framer-motion";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentQuestionIndexAtom,
  hasScoredNowAtom,
  languageStateAtom,
  scoreStateAtom,
} from "@/store/data";
import { Progress } from "@/components/ui/progress";
import { useListQuestions } from "@/data/question";
import { useParams } from "next/navigation";
import Image from "next/image";
import { TranslatedText } from "@/components/game/shared/translatedUI";

interface QuestionStepperProps {
  question: QuestionType | undefined;
  answers: AnswerType[] | undefined;
  onNext: () => void;
  onSelectAnswer: (answer: AnswerType | null) => void;
}

const QuestionStepper: React.FC<QuestionStepperProps> = ({
  question,
  answers,
  onNext,
  onSelectAnswer,
}) => {
  const { quizId } = useParams();

  const {
    data: questionDescriptions,
    isLoading: introLoading,
    error: introError,
  } = useListQuestionDescriptionsByQuestionId(question?.id as string);

  const {
    data: questions,
    isLoading: isLoadingQuestions,
    error: errorQuestions,
  } = useListQuestions(quizId as string);

  // Filter descriptions by type
  const introDescription = questionDescriptions?.filter(
    (desc) => desc.type === "intro"
  );
  const outroDescription = questionDescriptions?.filter(
    (desc) => desc.type === "outro"
  );

  const [step, setStep] = useState(1); // 0: Intro, 1: Question, 2: Outro
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerType | null>(null);

  const score = useRecoilValue(scoreStateAtom);
  const [hasScored, setHasScored] = useRecoilState(hasScoredNowAtom);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useRecoilState(
    currentQuestionIndexAtom
  );

  const language = useRecoilValue(languageStateAtom);

  useEffect(() => {
    checkDescription();
  }, [question, questionDescriptions]);

  const checkDescription = () => {
    if (step === 0 && (!introDescription || introDescription?.length < 1)) {
      setStep(1); // Move directly to the question if no intro
    } else if (step === 0) {
      setStep(0); // Stay on intro if it exists
    }
  };

  const handleAnswerSelect = (answer: AnswerType) => {
    setSelectedAnswer(answer);
    onSelectAnswer(answer);
    // setStep(2); // Move to Outro after selecting an answer
  };

  const handleNext = () => {
    if (step === 2) {
      setHasScored(false);
      // Remove the automatic jump to the next question
      // onNext(); // Move to the next question
      setStep(0); // Reset to Intro for the next question
      setSelectedAnswer(null); // Reset selected answer
    } else {
      if (step === 1 && (!outroDescription || outroDescription?.length < 1)) {
        setHasScored(false);
        setSelectedAnswer(null);
        onNext();
        setStep(0);
      } else {
        setStep(step + 1); // Move to the next step
      }
    }
  };

  console.log({ outroDescription, introDescription, questionDescriptions });

  return (
    <div className="flex flex-col items-center">
      {step === 0 && introDescription && (
        <div className="text-center flex flex-col gap-16">
          <h2 className="text-lg font-bold text-white">
            {introDescription?.[0]?.text}
          </h2>

          {introDescription?.[0]?.image &&
            introDescription?.[0]?.image !== "" && (
              <div className="relative aspect-video">
                <Image
                  src={introDescription?.[0]?.image}
                  //src="https://twg-euwest2-prod-s3.s3.eu-west-2.amazonaws.com/1728317674901.webp"
                  fill
                  alt=""
                  className="object-fill"
                />
              </div>
            )}
          <div className="w-full flex items-center justify-end ">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              //onClick={handleNextQuestion}
              onClick={handleNext}
              className="p-4 px-8 text-white bg-green font-bold w-fit h-fit rounded-lg cursor-pointer disabled:cursor-not-allowed"
            >
              <TranslatedText textKey="next" language={language} />
            </motion.button>
          </div>

          {/* <Button onClick={handleNext} className="mt-4">
            Começar
          </Button> */}
        </div>
      )}
      {step === 1 && question && (
        <div>
          <div className="flex flex-col gap-5 justify-center items-center">
            <span className="text-white text-2xl font-bold">
              {currentQuestionIndex + 1} / {questions?.length}
            </span>
            <Progress
              value={(currentQuestionIndex / (questions?.length || 100)) * 100}
              className="mb-4 h-2 w-4/6 bg-gray-200 rounded-none"
            />
          </div>
          <div className="text-center">
            {/* <h2 className="text-2xl font-bold">{question.text}</h2> */}
            <div className="flex flex-col gap-4 mt-4">
              {/* Render the appropriate answer component based on question type */}
              {question.type === "single_answer" && (
                <SingleAnswer
                  question={question}
                  answers={answers || []}
                  //onSelectAnswer={handleAnswerSelect}
                />
              )}
              {/* {question.type === "multiple_answer" && (
              <CoEMultipleAnswer question={question} answers={answers} onSelectAnswer={handleAnswerSelect} />
            )} */}
              {question.type === "dnd" && (
                <DndQuestion
                  question={question}
                  answers={answers || []} // Provide a default empty array if answers is undefined
                  //onSelectAnswer={handleAnswerSelect}
                />
              )}
              {question.type === "pairs" && (
                <CorrespondingPairsQuiz
                  setUserPairings={() => {}}
                  question={question}
                  answers={answers || []}
                  //onSelectAnswer={handleAnswerSelect}
                />
              )}
              {question.type === "multiple_answer" && (
                <CorrespondingPairsQuiz
                  setUserPairings={() => {}}
                  question={question}
                  answers={answers || []}
                  //onSelectAnswer={handleAnswerSelect}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {step !== 0 && (
        <div className="text-center m-20 text-white text-lg gap-10 flex flex-col">
          {step === 2 &&
            (outroDescription && outroDescription?.[0] && hasScored
              ? outroDescription?.[0]?.successText
              : outroDescription?.[0]?.failureText)}
          <div className="w-full flex items-center justify-end ">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              //onClick={handleNextQuestion}
              onClick={handleNext}
              className="p-4 px-8 text-white bg-green font-bold w-fit h-fit rounded-lg cursor-pointer disabled:cursor-not-allowed"
            >
              <TranslatedText textKey="next" language={language} />
            </motion.button>
          </div>

          {/* <Button onClick={handleNext} className="mt-4">
            Próxima Pergunta
          </Button> */}
        </div>
      )}
    </div>
  );
};

export default QuestionStepper;
