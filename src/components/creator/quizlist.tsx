"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListChecksIcon } from "@/assets/icons/list-checks";
import { ClockIcon } from "@/assets/icons/clock";
import { QuestionType, QuizType, AnswerType } from "@/lib/types";
import { EditingQuizAtom, quizAtom } from "@/store/data";
import { useRecoilState } from "recoil";
import EditQuiz from "./quiz-editor";
import QACreator from "./qa";
import { useListModules } from "@/data/module";

export default function QuizList() {
  const { data: quizzesResponse, isLoading, error } = useListModules();
//   const [quizzes, setQuizzes] = useRecoilState<QuizType[] | null>(quizAtom);
  const [editingQuiz, setEditingQuiz] = useRecoilState<QuizType | null>(
    EditingQuizAtom
  );

  let quizzes = quizzesResponse?.filter((quiz: QuizType, index: number) => quiz?.type !== "game")

  //   const handleEditQuiz = (quiz: QuizType) => {
  //     setEditingQuiz(quiz);
  //   };

  //   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     const formData = new FormData(e.currentTarget);
  //     const newQuiz: QuizType = {
  //       id: editingQuiz ? editingQuiz.id : Date.now(),
  //       title: formData.get("title") as string,
  //       description: formData.get("description") as string,
  //       timeLimit: Number(formData.get("timeLimit")),
  //       minimum_points: Number(formData.get("approvalPercentage")),
  //       moduleReference: formData.get("moduleReference") as string,
  //       position: Number(formData.get("position")),
  //       questions: [],
  //       image: "",
  //     };

  //     if (editingQuiz) {
  //       quizzes &&
  //         setQuizzes(quizzes.map((q) => (q.id === editingQuiz.id ? newQuiz : q)));
  //     } else {
  //       quizzes && quizzes?.length > 0
  //         ? setQuizzes([...quizzes, newQuiz])
  //         : setQuizzes([newQuiz]);
  //     }
  //     setEditingQuiz(null);
  //   };

  const changeEditToCreate = () => {
    setEditingQuiz(null);
  };

  return (
    <div className="container mx-auto p-4 w-full">
      {/* <h1 className="text-2xl font-bold mb-4">Quiz Manager</h1> */}
      <div className="flex w-full gap-6 transition-all duration-1000">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-between">
             <></>
              <EditQuiz
                changeEditToCreate={changeEditToCreate}
                btnCaption="Criar Quiz"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full h-screen max-h-screen overflow-y-scroll ">
            <div className="w-full flex gap-5 flex-wrap">
              {quizzes &&
                quizzes.map((quiz) => (
                  <Card
                    key={quiz.id}
                    className={`mb-4 cursor-pointer transition-colors ${
                      editingQuiz?.id === quiz.id
                        ? "border-black  shadow-xl duration-500"
                        : ""
                    }`}
                    onClick={() => setEditingQuiz(quiz)}
                  >
                    <CardHeader>
                      <CardTitle>{quiz.name}</CardTitle>
                      <CardDescription className="text-sm flex gap-3">
                        <div>Modulo: {quiz.module_reference}</div>
                        <div>Posição: {quiz.position}</div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-muted-foreground gap-4">
                        <div className="flex items-center gap-2">
                          <ListChecksIcon />
                          {/* {quiz.questions?.length} Perguntas */}
                        </div>
                        <div className="flex items-center gap-2">
                          <ClockIcon />
                          {quiz.time_limit} minutes
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>

        {editingQuiz && <QACreator />}
      </div>
    </div>
  );
}
