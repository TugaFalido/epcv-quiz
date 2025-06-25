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
import { useCreateAnswer } from "@/data/answer";
import { PlusIcon } from "@/assets/icons/plus-icon";
import { QuestionType } from "@/lib/types";
import { Loader2Icon } from "lucide-react";
import { useRef } from "react";

const AnswerFormSchema = z.object({
  isCorrect: z.boolean().default(false).optional(),
  text: z.string(),
});

export function AddAnswer({
  editingQuestion,
}: {
  editingQuestion: QuestionType;
}) {
  const [correctAnswer, setCorrectAnswer] = useRecoilState(
    SelectedCorrectAnswerAtom
  );

  const cancelRef = useRef<HTMLButtonElement>(null);

  console.log({ correctAnswer });

  // const editingQuestion = useRecoilValue(EditingQuestionAtom);

  const form = useForm<z.infer<typeof AnswerFormSchema>>({
    resolver: zodResolver(AnswerFormSchema),
    defaultValues: {
      isCorrect: false,
      text: "",
    },
  });

  const createAnswerMutation = useCreateAnswer();

  const handleSubmit = (data: z.infer<typeof AnswerFormSchema>) => {
    console.log(data);
    createAnswerMutation.mutate(
      {
        question_id: editingQuestion!.id,
        text: data.text,
        isCorrect: 0,
      },
      {
        onSuccess: () => {
          form.reset();
          cancelRef.current?.click();
        },
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-black bg-white">
          <PlusIcon />
          Adicionar resposta
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar resposta</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-5 "
        >
          <div className="w-full">
            <Label htmlFor="answerText">Resposta</Label>
            <Input type="text" id="answerText" {...form.register("text")} />
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
              className="bg-edit-button text-white flex gap-5"
            >
              {createAnswerMutation.isPending && (
                <Loader2Icon className="animate-spin" />
              )}
              Adicionar
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
