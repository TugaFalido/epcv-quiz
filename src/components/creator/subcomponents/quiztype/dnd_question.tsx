"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { QuestionType } from "@/lib/types";
import { useCreateQuestion } from "@/data/question";
import { useCreateAnswer } from "@/data/answer";
import { useRecoilValue } from "recoil";
import { EditingQuizAtom } from "@/store/data";
import { toast } from "sonner";

type DragDropQuestion = {
  id: string;
  text: string;
};

export default function DNDQuestionCreator() {
  const editindQuiz = useRecoilValue(EditingQuizAtom);

  const [words, setWords] = useState<string[]>([]);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType>({
    id: "",
    text: "",
    points: "0",
    module_id: editindQuiz?.id?.toString() || "",
    type: "dnd",
  });

  // hooks
  const createQuestionMutation = useCreateQuestion();
  const createAnswerMutation = useCreateAnswer();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    currentQuestion &&
      setCurrentQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleWordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const wordsSplitted = e.target.value.split(",").map((word) => word.trim());
    setWords(wordsSplitted);
  };

  const handleAddQuestion = () => {
    if (currentQuestion.text && words.length > 0) {
      const blankCount = (currentQuestion.text.match(/\[blank\]/g) || [])
        .length;
      if (blankCount > words.length) {
        alert(
          `The number of [blank] placeholders (${blankCount}) does not match the number of words (${words.length}).`
        );
        return;
      }

      createQuestionMutation.mutateAsync(
        {
          text: currentQuestion.text,
          type: currentQuestion.type,
          points: currentQuestion.points,
          module_id: editindQuiz?.id?.toString() || "",
        },
        {
          onSuccess: (data: any) => {
            console.log("Pergunta criada com sucesso:", data);
            words.forEach((word, index) => {
              createAnswerMutation.mutateAsync(
                {
                  text: word,
                  correct_order: index + 1, // Starting from 1
                  isCorrect: 1, // Assuming all words are correct for simplicity
                  question_id: data?.id,
                  pair: "any",
                },
                {
                  onSuccess: (answerData: any) => {
                    console.log("Resposta criada com sucesso:", answerData);

                    setCurrentQuestion({
                      id: "",
                      text: "",
                      module_id: editindQuiz?.id?.toString() || "",
                      points: "0",
                      type: "dnd",
                    });

                    setWords([]);

                    toast.success("pergunta criada com sucesso");
                  },
                  onError: (error) => {
                    console.error("Erro ao criar resposta:", error);
                    toast.error("erro ao criar pergunta ou respostas");
                  },
                }
              );
            });
          },
          onError: (error: unknown) => {
            console.error("Erro ao criar pergunta:", error);
          },
        }
      );
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // const newCorrectOrder = Array.from(currentQuestion.correctOrder);
    // const [reorderedItem] = newCorrectOrder.splice(result.source.index, 1);
    // newCorrectOrder.splice(result.destination.index, 0, reorderedItem);

    // setCurrentQuestion((prev) => ({ ...prev, correctOrder: newCorrectOrder }));
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Criar uma pergunta Drag and Drop</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="questionText">
                Pergunta (use [blank] para espaços)
              </Label>
              <Textarea
                id="questionText"
                name="text"
                value={currentQuestion.text}
                onChange={handleInputChange}
                placeholder="Digite a pergunta com espaços [blank]"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="words">Palavras (separadas por vírgula)</Label>
              <Textarea
                id="words"
                name="words"
                value={words.join(", ")}
                onChange={handleWordsChange}
                placeholder="Digite as palavras separadas por vírgula"
                rows={2}
              />
            </div>

            <Button className="bg-black text-white" onClick={handleAddQuestion}>
              Adicionar pergunta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
