"use client";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { AnswerType, QuestionType } from "@/lib/types";
import { useDeleteQuestion } from "@/data/question";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { EditingQuestionAtom, SelectedCorrectAnswerAtom } from "@/store/data";
import {
  useDeleteAnswer,
  useListAnswers,
  useUpdateAnswer,
} from "@/data/answer";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CoEQuestion } from "./CoEQuestion";
import { AddAnswer } from "./addAnswer";
import { Loader2, PencilIcon, TrashIcon } from "lucide-react";
import { EditAnswer } from "./EditAnswer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IntroOutroContent from "./intro-outro/dialog-content";

export function QuestionItem({ question }: { question: QuestionType }) {
  const {
    data: answersList,
    isLoading: loadingAnswers,
    error: asnwersError,
  } = useListAnswers(question?.id);
  const deleteQuestionMutation = useDeleteQuestion();
  const deleteAnswerMutation = useDeleteAnswer();
  const updateAnswerMutation = useUpdateAnswer();

  const [editingQuestion, setEditingQuestion] =
    useRecoilState<QuestionType | null>(EditingQuestionAtom);

  const [hasCorrectAnswer, setHasCorrectAnswer] = useRecoilState(
    SelectedCorrectAnswerAtom
  );

  useEffect(() => {
    const checkCorrectAnswer = () => {
      if (answersList && answersList.length > 0) {
        const correctAnswer = answersList.find(
          (answer: AnswerType) => answer.isCorrect
        );

        if (correctAnswer) {
          setHasCorrectAnswer(correctAnswer);
        }
      }
    };
    checkCorrectAnswer();
  }, [answersList]);

  const handleEditQuestion = (question: QuestionType) => {
    setEditingQuestion(question);
  };

  const handleDeleteQuestion = (id: string) => {
    // setQuestions(questions.filter((q) => q.id !== id));
    deleteQuestionMutation.mutate(id);
  };

  const handleEditAnswer = (id: string) => {};

  const handleDeleteAnswer = (id: string) => {
    // setDeletingAnswer(id);
    deleteAnswerMutation.mutate(id);
  };

  return (
    <AccordionItem
      value={question.text}
      key={question.id}
      className="border px-4 rounded-xl"
    >
      <AccordionTrigger className="flex justify-between">
        <span>{question.text}</span>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-10">
        <Table>
          <TableHeader>
            <TableHead>Resposta</TableHead>
            <TableHead>Opção Correta?</TableHead>
          </TableHeader>
          <TableBody>
            {answersList && answersList.length > 0 ? (
              answersList?.map((answer: AnswerType, index: number) => (
                <TableRow key={answer.id}>
                  <TableCell>{answer.text}</TableCell>
                  <TableCell>
                    <Select
                      value={answer.isCorrect?.toString()}
                      onValueChange={(value) => {
                        const newIsCorrect = value === "1" ? 1 : 0;
                        updateAnswerMutation.mutate({
                          answer_id: answer.id!,
                          data: { ...answer, isCorrect: newIsCorrect },
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-dialog">
                        <SelectItem value="1">Sim</SelectItem>
                        <SelectItem value="0">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <EditAnswer
                        editingAnswer={answer}
                        editingQuestion={question}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Delete answer"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-dialog">
                          <AlertDialogHeader>Apagar resposta</AlertDialogHeader>
                          <AlertDialogDescription>
                            Tem certeza de que deseja excluir esta resposta?
                          </AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button
                                className="bg-delete-button text-white"
                                onClick={() => {
                                  handleDeleteAnswer(answer.id!);
                                }}
                              >
                                Apagar
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <div></div>
            )}

            <TableFooter className="flex border-none w-full mt-5 ">
              <AddAnswer editingQuestion={question} />
            </TableFooter>
          </TableBody>
        </Table>

        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="text-black bg-transparent outline border ml-3"
                //onClick={() => handleEditQuestion(question)}
              >
                Editar Intro/Outro
              </Button>
            </DialogTrigger>
            <IntroOutroContent question={question} />
          </Dialog>
          <Dialog>
            <DialogTrigger>
              <Button
                className="text-white bg-edit-button"
                onClick={() => handleEditQuestion(question)}
              >
                Editar pergunta
              </Button>
            </DialogTrigger>
            <CoEQuestion />
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button className="text-white bg-delete-button">
                Apagar pergunta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-dialog">
              <AlertDialogHeader>Apagar pergunta</AlertDialogHeader>
              <AlertDialogDescription>
                Tem certeza de que deseja excluir a pergunta?
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <Button
                  className="bg-delete-button text-white flex gap-2"
                  onClick={() => handleDeleteQuestion(question.id)}
                  disabled={deleteQuestionMutation?.isPending}
                >
                  {deleteQuestionMutation?.isPending && (
                    <Loader2 className="animate-spin w-4 h-4 " />
                  )}
                  Apagar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
