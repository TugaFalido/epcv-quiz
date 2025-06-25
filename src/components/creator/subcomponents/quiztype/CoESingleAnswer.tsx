import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useListAnswers, useUpdateAnswer } from "@/data/answer";
import { useRecoilValue, useRecoilState } from "recoil";
import { EditingQuizAtom, EditingQuestionAtom } from "@/store/data";
import { useState, useEffect, useRef } from "react";
import { QueryClient } from "@tanstack/react-query";
import { useCreateQuestion, useUpdateQuestion } from "@/data/question";
import { AnswerType, QuestionType } from "@/lib/types";
import { toast } from "sonner";
const queryClient = new QueryClient();

export default function CoESingleAnswer() {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const editingQuiz = useRecoilValue(EditingQuizAtom);
  const [editingQuestion, setEditingQuestion] =
    useRecoilState<QuestionType | null>(EditingQuestionAtom);

  const [newQuestion, setNewQuestion] = useState<Partial<QuestionType>>(
    editingQuestion || {
      text: "",
      points: "",
      module_id: editingQuiz?.id?.toString() || "",
      type: "single_answer",
    }
  );

  const [newAnswers, setNewAnswers] = useState<AnswerType[] | null>(null);

  const {
    data: answersList,
    isLoading: loadingAnswers,
    error: asnwersError,
  } = useListAnswers(editingQuestion?.id ?? "");

  const createQuestionMutation = useCreateQuestion();
  const updateQuestionMutation = useUpdateQuestion();
  const updateAnswerMutation = useUpdateAnswer();

  useEffect(() => {
    if (editingQuestion) {
      setNewQuestion(editingQuestion);
    }
    if (answersList) {
      setNewAnswers(answersList);
    }
  }, [editingQuestion, answersList]);

  const resetFields = () => {
    setNewAnswers(null);
    setEditingQuestion(null);
    queryClient.invalidateQueries({
      queryKey: ["answers", editingQuestion?.id],
    });
  };

  const handleSaveQuestion = () => {
    if (editingQuestion) {
      const updatedQuestion: QuestionType = {
        id: editingQuestion.id,
        text: newQuestion.text ?? "",
        points: newQuestion.points ?? "",
        module_id: editingQuiz?.id?.toString() ?? "",
        type: "single_answer",
      };
      updateQuestionMutation.mutate(
        {
          question_id: editingQuestion.id,
          data: updatedQuestion,
        },
        {
          onSuccess: () => {
            toast.success("Pergunta atualizada com sucesso");
            resetFields();
          },
          onError: (error) => {
            toast.error("Erro ao atualizar pergunta");
          },
        }
      );
    } else {
      if (newQuestion.text && newQuestion.module_id) {
        createQuestionMutation.mutate(newQuestion as Partial<QuestionType>, {
          onSuccess: () => {
            toast.success("Pergunta criada com sucesso");
            resetFields();
            setNewQuestion({
              points: "0",
              text: "",
              module_id: editingQuiz?.id?.toString() ?? "",
              type: "single_answer",
            });
            cancelRef?.current?.click();
          },
          onError: (error) => {
            toast.error("Erro ao criar pergunta");
          },
        }); // Type assertion
      } else {
        toast.error("Please fill in all required fields");
        return;
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    setNewQuestion({
      points: "0",
      text: value,
      module_id: editingQuiz?.id?.toString() ?? "",
      type: "single_answer",
    });
  };

  return (
    <div className="space-y-4 flex flex-col gap-5">
      <div>
        <Label htmlFor="questionText">Pergunta</Label>
        <Input
          id="questionText"
          name="text"
          value={newQuestion.text}
          onChange={handleInputChange}
          placeholder="Insira a pergunta"
        />
      </div>

      {/* {newAnswers &&
            newAnswers?.map((answer: AnswerType, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex-grow">
                  <Label htmlFor={`answer${index}`} className="sr-only">
                    Resposta {index + 1}
                  </Label>
                  <Input
                    id={`answer${index}`}
                    name="answers"
                    value={answer?.text}
                    onChange={(e: any) => handleInputChange(e, index)}
                    placeholder={`${
                      index === 0
                        ? "Insira a resposta correta"
                        : "Resposta " + (index + 1)
                    }`}
                  />
                </div>
                {newAnswers!.length > 2 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeAnswer(index)}
                    aria-label={` Remover resposta ${index + 1}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          <Button
            onClick={addAnswer}
            variant="outline"
            className="w-full flex gap-3 rounded-xl"
          >
            <PlusIcon /> Adicionar resposta
          </Button> */}

      <div className="flex justify-start gap-3">
        <Button
          onClick={handleSaveQuestion}
          className="bg-black text-white rounded-full hover:bg-black/500"
          disabled={
            updateQuestionMutation.isPending || createQuestionMutation.isPending
          }
        >
          {updateQuestionMutation.isPending ||
            (createQuestionMutation.isPending && (
              <Loader2 className="animate-spin" />
            ))}
          {editingQuestion ? "Atualizar a Pergunta" : "Criar pergunta"}
        </Button>
        <DialogClose
          ref={cancelRef}
          onClick={resetFields}
          className=" text-black rounded-full px-4 border border-black hover:bg-black/500"
        >
          Cancelar
        </DialogClose>
      </div>
    </div>
  );
}
