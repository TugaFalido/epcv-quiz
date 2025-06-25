import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditingQuestionAtom, SelectedCorrectAnswerAtom } from "@/store/data";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useCreateAnswer, useUpdateAnswer } from "@/data/answer";
import { PlusIcon } from "@/assets/icons/plus-icon";
import { AnswerFormSchema, AnswerType, QuestionType } from "@/lib/types";
import { Loader2Icon, PencilIcon } from "lucide-react";
import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

export function EditAnswer({
  editingQuestion,
  editingAnswer,
}: {
  editingQuestion: QuestionType;
  editingAnswer: AnswerType;
}) {
  const [correctAnswer, setCorrectAnswer] = useRecoilState(
    SelectedCorrectAnswerAtom
  );
  const cancelRef = useRef<HTMLButtonElement>(null);

  console.log({ correctAnswer });

  // const editingQuestion = useRecoilValue(EditingQuestionAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof AnswerFormSchema>>({
    resolver: zodResolver(AnswerFormSchema),
    defaultValues: {
      isCorrect: editingAnswer.isCorrect,
      text: editingAnswer.text,
      info: editingAnswer.info,
    },
  });

  const updateAnswerMutation = useUpdateAnswer();

  const onSubmit = (data: z.infer<typeof AnswerFormSchema>) => {
    if (editingAnswer && editingAnswer?.id) {
      updateAnswerMutation.mutate(
        {
          answer_id: editingAnswer!.id,
          data: {
            question_id: editingQuestion!.id,
            text: data.text,
            isCorrect: editingAnswer.isCorrect,
            info: data?.info ?? "",
          },
        },
        {
          onSuccess: () => {
            cancelRef.current?.click();
          },
        }
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Edit answer">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar resposta</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 "
        >
          <div className="w-full flex flex-col gap-5">
            <Label htmlFor="answerText">Resposta</Label>
            <Input type="text" id="answerText" {...register("text")} />
            <Input
              id="answerText"
              {...register("question_id")}
              className="hidden"
            />
            <Input
              id="isCorrect"
              {...register("isCorrect")}
              className="hidden"
            />
            <Label htmlFor="answerText">Informação adicional</Label>
            <Textarea id="question_info" {...register("info")} className="" />
          </div>

          {/* <div className="flex gap-5 h-full w-full items-center">
            <Checkbox
              {...form.register("isCorrect")}
              id={"isCorrect"}
              disabled={correctAnswer?.isCorrect === 1}
              className="w-5 h-5 border-2 border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
            />
            <Label htmlFor="isCorrect" className="text-lg">
              Resposta correta
            </Label>
          </div> */}

          <div className="flex justify-end gap-5 ">
            <Button
              type="submit"
              className="bg-edit-button flex gap-5 text-white"
            >
              {updateAnswerMutation.isPending && (
                <Loader2Icon className="animate-spin" />
              )}
              Guardar
            </Button>
            <DialogClose asChild>
              <Button variant="outline" className="border-2" ref={cancelRef}>
                Cancelar
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
