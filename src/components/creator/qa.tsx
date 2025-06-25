"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash, X } from "lucide-react";
import { PlusIcon } from "@/assets/icons/plus-icon";
import { useRecoilState, useRecoilValue } from "recoil";
import { EditingQuestionAtom, EditingQuizAtom, qaAtom } from "@/store/data";
import { toast } from "sonner";
import EditQuiz from "./quiz-editor";
import {
  useCreateQuestion,
  useDeleteQuestion,
  useListQuestions,
  useUpdateQuestion,
} from "@/data/question";
import {
  AnswerType,
  ModuleDescriptionType,
  ModuleOutroDescriptionType,
  QuestionType,
} from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useListAnswers } from "@/data/answer";
import { QuestionItem } from "./subcomponents/questionItem";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { CoEQuestion } from "./subcomponents/CoEQuestion";
import DeleteQuiz from "./quiz-delete";
import {
  useCreateModuleDescription,
  useModuleDescriptionByModuleId,
  useUpdateModuleDescription,
} from "@/data/module-description";
import {
  useCreateQuestionDescription,
  useUpdateQuestionDescription,
} from "@/data/question-descriptions";

type Question = {
  id: string;
  text: string;
  answers: string[];
  correctAnswer: string;
};

export default function QACreator() {
  const editingQuiz = useRecoilValue(EditingQuizAtom);

  const { data: moduleDescriptions } = useModuleDescriptionByModuleId(
    editingQuiz ? editingQuiz.id.toString() : ""
  ) as {
    data: (ModuleOutroDescriptionType & { id: string })[] | undefined;
    error: Error | null;
    loading: boolean;
  };

  //   const [questions, setQuestions] = useRecoilState<Question[]>(qaAtom);

  const [editingQuestion, setEditingQuestion] =
    useRecoilState<QuestionType | null>(EditingQuestionAtom);
  const [newQuestion, setNewQuestion] = useState<QuestionType>({
    id: "",
    text: "",
    points: "",
    module_id: "",
    type: "",
  });

  const [newAnswers, setNewAnswers] = useState<AnswerType[] | null>(null);
  const [newDescription, setNewDescription] = useState("");

  //hooks
  const {
    data: questions,
    isLoading: loadingQuestions,
    error: questionsError,
  } = useListQuestions(editingQuiz ? editingQuiz.id.toString() : "");

  const outroDescription = moduleDescriptions?.find(
    (desc) => desc.type === "outro"
  );

  const createDescription = useCreateModuleDescription();
  const updateDescription = useUpdateModuleDescription(
    outroDescription?.id || ""
  );

  let link =
    editingQuiz?.type === "game"
      ? `https://${window.location.host}/game/${editingQuiz?.id}`
      : `https://${window.location.host}/quiz/${editingQuiz?.id}`;

  useEffect(() => {
    const initData = () => {
      if (outroDescription && outroDescription?.text)
        setNewDescription(outroDescription?.text);
    };
    initData();
  }, [outroDescription]);

  const addAnswer = () => {
    // setNewQuestion((prev) => ({
    //   ...prev,
    //   answers: [...(prev.answers || []), ""],
    // }));
  };

  const handleCancel = () => {
    setEditingQuestion(null);
    setNewQuestion({ id: "", text: "", points: "", module_id: "", type: "" });
  };

  const handleUpdateDesc = async () => {
    const descriptionData = {
      text: newDescription,
      module_id: editingQuiz?.id?.toString(),
      image: "",
      type: "outro" as const,
    };

    if (outroDescription && outroDescription?.text) {
      await updateDescription.mutateAsync(descriptionData);
    } else {
      await createDescription.mutateAsync(descriptionData, {
        onSuccess(data, variables, context) {
          toast.success("Conclusão criada com sucesso");
        },
      });
    }
  };

  console.log({ outroDescription, quizId: editingQuiz?.id });

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex w-full justify-between">
          <h1 className="text-3xl font-bold mb-6">{editingQuiz?.name}</h1>

          <div className="flex gap-5 items-center">
            {editingQuiz?.id && <DeleteQuiz id={editingQuiz?.id?.toString()} />}
            <EditQuiz changeEditToCreate={() => {}} btnCaption="Editar" />
          </div>
        </div>

        <div className="w-full flex justify-between rounded-lg border items-center px-3 p-1">
          <span>Link: {link}</span>
          <Button
            className="bg-black text-white flex gap-3 rounded-full text-[10px]"
            onClick={() => {
              navigator.clipboard
                .writeText(link)
                .then(() =>
                  toast.success("Link copiado para a área de transferência")
                )
                .catch(() => toast.error("Falha ao copiar o link"));
            }}
          >
            Copiar Link
          </Button>
        </div>

        <div className="flex space-x-4">
          <div>
            <span className="font-bold">Modulo:</span>{" "}
            {editingQuiz?.module_reference}
          </div>
          <div>
            <span className="font-bold">Posição:</span> {editingQuiz?.position}
          </div>
        </div>

        <div>
          <span className="font-bold">Descrição:</span>
          <p>{editingQuiz?.description}</p>
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <span className="font-bold">Conclusão:</span>
          <Input
            type="text"
            value={newDescription}
            onChange={(e) => {
              setNewDescription(e.target.value);
            }}
          />
          <Button
            onClick={handleUpdateDesc}
            className="bg-black text-white mx-0 w-1/4"
            disabled={
              outroDescription?.text === newDescription || !newDescription
            }
          >
            Salvar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex justify-between w-full">
          <CardTitle>Lista de perguntas</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="text-white bg-edit-button "
                onClick={() => setEditingQuestion(null)}
              >
                Nova pergunta
              </Button>
            </DialogTrigger>
            <CoEQuestion />
          </Dialog>
        </CardHeader>
        <CardContent>
          <Accordion
            type="single"
            collapsible
            className="flex flex-col gap-4 h-full"
          >
            {questions &&
              questions.map((question: any) => (
                <QuestionItem question={question} key={question.id} />
              ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
