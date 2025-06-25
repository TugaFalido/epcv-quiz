"use client";

import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetModule } from "@/data/module";
import { useListQuestions } from "@/data/question";
import { useListAnswers } from "@/data/answer";
import { useModuleDescriptionByModuleId } from "@/data/module-description";
import { useListQuestionDescriptionsByQuestionId } from "@/data/question-descriptions";
import {
  QuestionType,
  AnswerType,
  ModuleDescriptionType,
  QuestionDescriptionType,
} from "@/lib/types";
import {
  scoreStateAtom,
  hasScoredNowAtom,
  languageStateAtom,
  gameOverAtom,
  selectedAnswerAtom,
  hasAnsweredAtom,
} from "@/store/data";

import Image from "next/image";
import DndQuestion from "@/components/quiz/dndAnswer";
import SingleAnswer from "@/components/quiz/singleAnswer";
import CorrespondingPairsQuiz from "@/components/quiz/correspondingPairs";
import { Loader2, RotateCcw } from "lucide-react";
import { useParams } from "next/navigation";
import ConversationBubble from "../shared/conversationBubble";
import TypingText from "../shared/typeWriter";
import { CoinIcon } from "@/assets/icons/coin-icon";
import { TranslatedText } from "../shared/translatedUI";
import Confetti from "react-confetti"; // Import the Confetti component
import QuizSubmission from "@/components/result/resultSubmission";

type QuizStep =
  | { type: "module_description"; content: ModuleDescriptionType }
  | { type: "question_description"; content: QuestionDescriptionType }
  | { type: "question"; content: QuestionType }
  | { type: "completed" };

interface Pair {
  first: string;
  second: string;
}

export function QuestionCard() {
  const { quizId } = useParams();

  const language = useRecoilValue(languageStateAtom);

  const [score, setScore] = useRecoilState(scoreStateAtom);
  const [hasScored, setHasScored] = useRecoilState(hasScoredNowAtom);
  const [selectedAnswer, setSelectedAnswer] = useRecoilState<AnswerType | null>(
    selectedAnswerAtom
  );
  const [hasAnswered, setHAsAnswered] = useRecoilState(hasAnsweredAtom);
  const [gameOver, setGameOver] = useRecoilState(gameOverAtom);

  const [quizSteps, setQuizSteps] = useState<QuizStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);

  const [showGif, setShowGif] = useState(false);

  const { data: module } = useGetModule(quizId as string);
  const { data: moduleDescriptions } = useModuleDescriptionByModuleId(
    quizId as string
  );
  const { data: questions } = useListQuestions(quizId as string);
  const { data: answers } = useListAnswers(
    quizSteps[currentStepIndex]?.type === "question"
      ? quizSteps[currentStepIndex].content.id
      : ""
  );
  const { data: questionDescriptions } =
    useListQuestionDescriptionsByQuestionId(
      quizSteps[currentStepIndex]?.type === "question"
        ? quizSteps[currentStepIndex].content.id
        : questions?.[0]?.id
        ? questions?.[0]?.id
        : ""
    );

  const currentStep = quizSteps[currentStepIndex];

  const [userAnswers, setUserAnswers] = useState<
    {
      questionId: string;
      questionType: "single_answer" | "pairs" | "dnd";
      questionText: string;
      isCorrect: boolean;
      // Specific details based on question type
      userAnswer?: AnswerType;
      correctAnswer?: AnswerType;
      userPairings?: any[];
      correctPairings?: AnswerType[];
      userOrder?: AnswerType[];
      correctOrder?: AnswerType[];
    }[]
  >([]);

  const [quizQuestion, setQuizQuestion] = useState<{
    questionId: string;
    questionType: "single_answer" | "pairs" | "dnd";
    questionText: string;
    isCorrect: boolean;
    userAnswer?: AnswerType;
    correctAnswer?: AnswerType;
    userPairings?: Pair[];
    correctPairings?: AnswerType[];
    userOrder?: AnswerType[];
    correctOrder?: AnswerType[];
  }>({
    questionId: "",
    questionType: "single_answer",
    questionText: "",
    isCorrect: false,
  });

  const [pairings, setPairings] = useState<
    {
      questionId: string;
      pairs: { fromA: AnswerType; toB: AnswerType }[];
    }[]
  >([]);

  useEffect(() => {
    setScore(0);
    setHasScored(false);
  }, [quizId, setScore, setHasScored]);

  useEffect(() => {
    if (
      currentStep?.type === "question" &&
      currentStep?.content &&
      currentStep?.content?.type === "pair"
    ) {
      setShowGif(true);
    }

    const timer = setTimeout(() => {
      setShowGif(false);
    }, 100000);

    // Clean up the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, [currentStep]);

  // useEffect(() => {
  //   if (module && moduleDescriptions && questions && questionDescriptions) {
  //     const steps: QuizStep[] = [
  //       ...moduleDescriptions.map((desc) => ({
  //         type: "module_description" as const,
  //         content: desc,
  //       })),
  //       ...questions.flatMap((question) => [
  //         ...questionDescriptions
  //           .filter(
  //             (desc) =>
  //               desc.question_id === question.id && desc.type === "intro"
  //           )
  //           .map((desc) => ({
  //             type: "question_description" as const,
  //             content: desc,
  //           })),
  //         { type: "question" as const, content: question },
  //         ...questionDescriptions
  //           .filter(
  //             (desc) =>
  //               desc.question_id === question.id && desc.type === "outro"
  //           )
  //           .map((desc) => ({
  //             type: "question_description" as const,
  //             content: desc,
  //           })),
  //       ]),
  //       { type: "completed" as const },
  //     ];
  //     setQuizSteps(steps);
  //     console.log("Quiz Steps:", steps); // Debugging log
  //   }
  // }, [module, moduleDescriptions, questions, questionDescriptions]);

  useEffect(() => {
    if (module && moduleDescriptions && questions) {
      const steps = createQuizSteps(
        module,
        questions,
        questionDescriptions || []
      );
      setQuizSteps(steps);
      console.log("Quiz Steps:", steps); // Debugging log
    }
  }, [module, moduleDescriptions, questions]);

  const createQuizSteps = (
    module: any,
    questions: QuestionType[],
    questionDescriptions: any[]
  ): QuizStep[] => {
    const steps: QuizStep[] = [
      {
        type: "module_description" as const,
        content: {
          text: module.description,
          image: "",
          type: "",
          module_id: "",
        },
      },
      ...questions.flatMap((question) => [
        ...questionDescriptions
          .filter(
            (desc) => desc.question_id === question.id && desc.type === "intro"
          )
          .map((desc) => ({
            type: "question_description" as const,
            content: desc,
          })),
        { type: "question" as const, content: question },
        ...questionDescriptions
          .filter(
            (desc) => desc.question_id === question.id && desc.type === "outro"
          )
          .map((desc) => ({
            type: "question_description" as const,
            content: desc,
          })),
      ]),
      { type: "completed" as const },
    ];
    return steps;
  };

  const handleNextStep = () => {
    // if (currentStep?.type === "question") {
    //   setUserAnswers((prev) => [
    //     ...prev,
    //     {
    //       questionId: currentStep.content.id,
    //       userAnswer: selectedAnswer,
    //       isCorrect: hasScored,
    //       type: currentStep.content.type,
    //     },
    //   ]);
    // }

    if (currentStep?.type === "question") {
      let userAnswerDetails = {};

      switch (currentStep.content.type) {
        case "single_answer":
          // For single answer, find the correct answer
          const correctAnswer = answers?.find(
            (a) => a.question_id === currentStep.content.id && a.isCorrect === 1
          );
          userAnswerDetails = {
            userAnswer: selectedAnswer,
            correctAnswer: correctAnswer,
          };
          break;

        case "pairs":
          // For pairs, capture the full pairings
          userAnswerDetails = {
            userPairings:
              pairings.find((p) => p.questionId === currentStep.content.id)
                ?.pairs || [],
            correctPairings: answers?.filter(
              (a) => a.question_id === currentStep.content.id
            ),
          };
          break;

        case "dnd":
          // For drag and drop, capture the user's order and correct order
          userAnswerDetails = {
            userOrder: selectedAnswer, // Assuming this captures the user's order
            correctOrder: answers
              ?.filter((a) => a.question_id === currentStep.content.id)
              .sort((a, b) => (a.correct_order || 0) - (b.correct_order || 0)),
          };
          break;
      }

      setUserAnswers((prev) => [
        ...prev,
        {
          questionId: currentStep.content.id,
          questionType: currentStep.content.type as
            | "pairs"
            | "single_answer"
            | "dnd",
          questionText: currentStep.content.text,
          isCorrect: hasScored,
          ...userAnswerDetails,
        } as const,
      ]);
    }
    if (hasScored) {
      setScore(score + 1);
    }

    // Proceed to the next step if not at the last question
    if (currentStepIndex < quizSteps.length - 1) {
      setCurrentStepIndex((prevIndex) => prevIndex + 1);
      setHasScored(false);
      setSelectedAnswer(null);
      // setIsAvatarSpeaking(true);
      // setTimeout(() => setIsAvatarSpeaking(false), 1000); // Simulate avatar speaking
    }
  };

  // In your quiz completion handler
  // async function handleQuizComplete(quizResult) {
  //   try {
  //     const result = await submitQuizScore({
  //       score: quizResult.score,
  //       totalPossibleScore: quizResult.totalQuestions,
  //       lis_result_sourcedid: session.ltiData.lis_result_sourcedid,
  //       lis_outcome_service_url: session.ltiData.lis_outcome_service_url
  //     });

  //     if (result.success) {
  //       // Handle successful submission
  //     } else {
  //       // Handle failure
  //     }
  //   } catch (error) {
  //     // Handle error
  //   }
  // }

  const renderQuestion = (question: QuestionType, answers: AnswerType[]) => {
    switch (question.type) {
      case "dnd":
        return <DndQuestion question={question} answers={answers} />;
      case "single_answer":
        return <SingleAnswer question={question} answers={answers} />;
      case "pairs":
        return (
          <CorrespondingPairsQuiz
            question={question}
            answers={answers}
            setUserPairings={(newPairs: any) =>
              setPairings((prev) => [
                ...prev.filter((p) => p.questionId !== question.id),
                { questionId: question.id, pairs: newPairs },
              ])
            }
          />
        );
      default:
        console.error(`Unsupported question type: ${question.type}`);
        return <div>Unsupported question type: {question.type}</div>;
    }
  };

  const isWinner = questions ? score > questions?.length * 0.7 : false; // Check if score is more than 70%

  if (quizSteps.length === 0 && !module) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin mr-2" /> Loading exercise...
      </div>
    );
  }

  const outroDescription = moduleDescriptions?.find(
    (desc: ModuleDescriptionType) => desc?.type === "outro"
  );

  return (
    <>
      <div className="fixed bottom-0 left-3 w-fit h-fit z-10">
        <motion.div
          className="hidden md:flex md:w-36 md:h-36 lg:w-64 lg:h-64 xl:w-64 xl:h-64 w-28 h-28 overflow-hidden border-purple-500 border-b-4 z-10 relative "
          animate={isAvatarSpeaking ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <Image
            src="/avatar/explainer-2.png"
            alt="Quiz Avatar"
            fill
            className="object-cover"
          />
        </motion.div>
      </div>
      {isWinner && currentStep?.type === "completed" && (
        <Confetti className="w-full" />
      )}{" "}
      {/* Render confetti if the user wins */}
      <Card className="border-none w-full max-w-2xl min-h-screen flex flex-col justify-between relative">
        <CardHeader>
          <CardTitle className="text-xl text-center text-white flex justify-between">
            {/* {module?.name} */}
            {/* <div className="text-2xl font-bold flex items-center gap-2 rounded-full bg-purple-light pr-5 p-1 w-fit h-fit ">
              <CoinIcon /> {score}
            </div> */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex mb-4 relative h-fit gap-10 items-start flex-col">
                {/* {currentStep?.type !== "completed" && (
                  <div className="hidden md:block">
                    <ConversationBubble>
                      <h2 className="text-md lg:text-lg font-bold text-white h-fit">
                        {currentStep?.type === "module_description" ? (
                          "Exercise description"
                        ) : currentStep?.type === "question_description" ? (
                          ""
                        ) : (
                          <>
                            <TranslatedText
                              textKey="scene"
                              language={language}
                            />{" "}
                            {questions &&
                              questions.findIndex(
                                (q) => q.id === currentStep?.content?.id
                              ) + 1}
                          </>
                        )}
                      </h2>
                    </ConversationBubble>
                  </div>
                )} */}

                {currentStep?.type === "module_description" && (
                  <ConversationBubble>
                    <TypingText
                      text={currentStep?.content?.text}
                      className=""
                    />
                  </ConversationBubble>
                )}

                {/* {currentStep?.type === "question_description" &&
                  currentStep?.content?.type === "outro" &&
                  hasScored && (
                    <ConversationBubble>
                      <TypingText
                        text={currentStep?.content?.text}
                        className=""
                      />
                    </ConversationBubble>
                  )} */}

                {/* {currentStep?.type === "question_description" &&
                  currentStep?.content?.type === "outro" &&
                  !hasScored && (
                    <ConversationBubble>
                      <TypingText
                        text={currentStep?.content?.text}
                        className=""
                      />
                    </ConversationBubble>
                  )} */}

                {/* {currentStep?.type === "question_description" && (
                  <ConversationBubble>
                    <TypingText
                      text={currentStep?.content?.text}
                      className=""
                    />
                  </ConversationBubble>
                )} */}

                {currentStep?.type === "completed" && (
                  <div className="w-full flex items-center justify-center">
                    <ConversationBubble>
                      <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4 text-white">
                          <TranslatedText
                            textKey="complete"
                            language={language}
                          />
                        </h2>
                        <p className="text-xl mb-4 text-white">
                          <TranslatedText textKey="score" language={language} />
                          : {score}{" "}
                          <TranslatedText textKey="outof" language={language} />{" "}
                          {questions?.length}
                        </p>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          {questions && score === questions?.length ? (
                            <span className="text-4xl">🏆</span>
                          ) : questions && score >= questions?.length / 2 ? (
                            <span className="text-4xl">🎉</span>
                          ) : (
                            <span className="text-4xl">👍</span>
                          )}
                        </motion.div>

                        {outroDescription &&
                          outroDescription?.type === "outro" && (
                            <div className="flex w-full text-left p-0 m-0 my-10">
                              <TypingText
                                text={outroDescription?.text}
                                className=""
                              />
                            </div>
                          )}

                        {/* Add the answers summary section */}
                        <div className="mt-8 text-left">
                          <h3 className="text-xl font-bold mb-4 text-white">
                            <TranslatedText
                              textKey="answers"
                              language={language}
                            />
                            :
                          </h3>
                          <div className="space-y-4">
                            {questions?.map((question, index) => {
                              const userAnswerData = userAnswers.find(
                                (a) => a.questionId === question.id
                              );

                              return (
                                <div
                                  key={question.id}
                                  className="bg-purple-light/20 p-4 rounded-lg"
                                >
                                  <p className="font-bold text-white mb-2">
                                    {index + 1}. {question.text}
                                  </p>

                                  {question.type === "single_answer" && (
                                    <>
                                      {userAnswerData?.userAnswer !==
                                        userAnswerData?.correctAnswer?.text && (
                                        <div className="text-sm">
                                          <p className="text-green">
                                            <TranslatedText
                                              language={language}
                                              textKey="correctAnswers"
                                            />
                                            :{" "}
                                            {
                                              userAnswerData?.correctAnswer
                                                ?.text
                                            }
                                          </p>
                                          <p className="text-gray-900">
                                            <TranslatedText
                                              language={language}
                                              textKey="yourAnswer"
                                            />
                                            : {userAnswerData?.userAnswer?.text}
                                          </p>
                                        </div>
                                      )}
                                    </>
                                  )}

                                  {question.type === "pairs" && (
                                    <div className="text-sm overflow-y-scroll h-full">
                                      {!userAnswerData?.isCorrect && (
                                        <>
                                          <p className="text-green mb-2">
                                            <TranslatedText
                                              language={language}
                                              textKey="correctAnswers"
                                            />
                                            :
                                          </p>
                                          {userAnswerData?.correctPairings
                                            ?.filter((a) =>
                                              a.pair?.startsWith("A")
                                            )
                                            .map((answer, i) => {
                                              const correctPair =
                                                userAnswerData.correctPairings?.find(
                                                  (a) =>
                                                    a.pair ===
                                                    answer?.pair?.replace(
                                                      "A",
                                                      "B"
                                                    )
                                                );
                                              return (
                                                <p
                                                  key={i}
                                                  className="text-green p-2 bg-gray-500 my-4"
                                                >
                                                  {answer.text} ↔{" "}
                                                  {correctPair?.text}
                                                </p>
                                              );
                                            })}

                                          <p className="text-orange-500 mt-2">
                                            <TranslatedText
                                              language={language}
                                              textKey="yourAnswer"
                                            />
                                            :
                                          </p>
                                          {userAnswerData?.userPairings?.map(
                                            (pair: any, i: any) => (
                                              <p
                                                key={i}
                                                className="text-red-500 bg-gray-300 p-2 my-4"
                                              >
                                                {pair.fromA.text} ↔{" "}
                                                {pair.toB.text}
                                              </p>
                                            )
                                          )}
                                        </>
                                      )}
                                    </div>
                                  )}

                                  {/* {question.type === "dnd" && (
                                  <div className="text-sm">
                                    {!userAnswerData?.isCorrect && (
                                      <>
                                        <p className="text-green mb-2">
                                          Correct Order:
                                        </p>
                                        {userAnswerData?.correctOrder?.map(
                                          (answer: any, i: number) => (
                                            <p key={i} className="text-green">
                                              {i + 1}. {answer.text}
                                            </p>
                                          )
                                        )}

                                        <p className="text-red-500 mt-2">
                                          Your Order:
                                        </p>
                                        {userAnswerData?.userOrder?.map(
                                          (answer, i) => (
                                            <p key={i} className="text-red-500">
                                              {i + 1}. {answer.text}
                                            </p>
                                          )
                                        )}
                                      </>
                                    )}
                                  </div>
                                )} */}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </ConversationBubble>
                  </div>
                )}
              </div>

              {currentStep?.type === "question" &&
                answers &&
                renderQuestion(currentStep?.content, answers)}

              {currentStep?.type !== "completed" && (
                <div className="w-full flex items-center justify-end">
                  {currentStep?.type !== "module_description" ? (
                    <Button
                      disabled={!hasAnswered}
                      onClick={handleNextStep}
                      className="w-1/2 md:w-1/3 mt-4 bg-green hover:bg-green/90 text-black lg:text-lg text-sm font-bold"
                    >
                      {currentStepIndex === quizSteps.length - 2 ? (
                        <TranslatedText textKey="finish" language={language} />
                      ) : (
                        <TranslatedText textKey="next" language={language} />
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextStep}
                      className="w-1/2 md:w-1/3 mt-4 bg-green hover:bg-green/90 text-black lg:text-lg text-sm font-bold"
                    >
                      {currentStepIndex === quizSteps.length - 2 ? (
                        <TranslatedText textKey="finish" language={language} />
                      ) : (
                        <TranslatedText textKey="next" language={language} />
                      )}
                    </Button>
                  )}

                  {/* <h2 className="text-3xl font-bold ">
                    <TranslatedText textKey="complete" language={language} />
                  </h2>
                  <p className="text-xl mb-4 tex-white">
                    <TranslatedText textKey="score" language={language} />:{" "}
                    {score}/{questions?.length || 0}
                  </p>
                  <Button
                    //onClick={resetGame}
                    className="w-1/2 bg-green text-black flex items-center gap-2"
                  >
                    <RotateCcw className="hover:-rotate-180 duration-500 " />
                    <TranslatedText textKey="playagain" language={language} />
                  </Button>

                  <QuizSubmission
                    score={score}
                    totalQuestions={questions?.length || 0}
                  /> */}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      {showGif && (
        <div className="fixed bottom-5 right-5 border-2 border-white w-52 h-52 ">
          <Image
            src="/gifs/correspondingPair.gif" // Replace with actual GIF path
            alt="Celebration Gif"
            className="object-fill" // Adjust size as needed
            fill
          />
        </div>
      )}
    </>
  );
}
