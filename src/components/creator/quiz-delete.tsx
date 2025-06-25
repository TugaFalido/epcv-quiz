import React from "react";
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
import { useDeleteModule } from "@/data/module";
import { QuestionType, QuizType } from "@/lib/types";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { EditingQuestionAtom } from "@/store/data";
import { useRecoilState } from "recoil";

export default function DeleteQuiz({ id }: { id: string }) {
  const deleteQuizMutation = useDeleteModule();

  const [editingQuestion, setEditingQuestion] =
    useRecoilState<QuestionType | null>(EditingQuestionAtom);

  const handleDeleteQuiz = (id: string) => {
    setEditingQuestion(null)
    deleteQuizMutation.mutate(id);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="text-white bg-delete-button">Apagar quiz</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-dialog">
        <AlertDialogHeader>Apagar quiz</AlertDialogHeader>
        <AlertDialogDescription>
          Tem certeza de que deseja excluir o quiz?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-delete-button text-white flex gap-2"
              onClick={() => handleDeleteQuiz(id)}
              disabled={deleteQuizMutation?.isPending}
            >
              {deleteQuizMutation?.isPending && (
                <Loader2 className="animate-spin w-4 h-4 " />
              )}
              Apagar
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
