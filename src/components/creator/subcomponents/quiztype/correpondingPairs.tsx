"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";
import { AnswerType, QuestionType, QuizType } from "@/lib/types";
import { useRecoilState } from "recoil";
import { EditingQuizAtom } from "@/store/data";
import { useCreateQuestion, useUpdateQuestion } from "@/data/question";
import { useCreateAnswer } from "@/data/answer";

export default function CorrespondingPairs() {
  // hooks
  const createQuestionMutation = useCreateQuestion();
  const createAnswerMutation = useCreateAnswer();
  const updateQuestionMutation = useUpdateQuestion();

  // states
  const [editingQuiz, setEditingQuiz] = useRecoilState<QuizType | null>(
    EditingQuizAtom
  );
  const [description, setDescription] = useState<QuestionType>({
    id: "",
    text: "",
    points: "",
    module_id: editingQuiz?.id?.toString() || "",
    type: "pairs",
  });

  const [answerPairs, setAnswerPairs] = useState<AnswerType[]>([
    {
      id: "1",
      text: "",
      isCorrect: 0,
      question_id: "",
      pair: "A1",
      correct_order: 0,
    },
    {
      id: "2",
      text: "",
      isCorrect: 0,
      question_id: "",
      pair: "B1",
      correct_order: 0,
    },
  ]);

  const addAnswerPair = () => {
    const newId = answerPairs.length + 1;
    const newPairA: AnswerType = {
      id: newId.toString(),
      text: "",
      isCorrect: 0,
      question_id: "",
      pair: `A${Math.ceil(newId / 2)}`,
      correct_order: 0,
    };
    const newPairB: AnswerType = {
      id: (newId + 1).toString(),
      text: "",
      isCorrect: 0,
      question_id: "",
      pair: `B${Math.ceil(newId / 2)}`,
      correct_order: 0,
    };
    setAnswerPairs([...answerPairs, newPairA, newPairB]);
  };

  const updateAnswerPair = (id: string, value: string) => {
    setAnswerPairs(
      answerPairs.map((pair) =>
        pair.id === id ? { ...pair, text: value } : pair
      )
    );
  };

  const removeAnswerPair = (id: string) => {
    const pairIndex = answerPairs.findIndex((pair) => pair.id === id);
    if (pairIndex !== -1 && answerPairs.length > 2) {
      const newPairs = [...answerPairs];
      newPairs.splice(pairIndex, 2);
      setAnswerPairs(newPairs);
    }
  };

  const handleSubmit = () => {
    if (!description.text || answerPairs.some((pair) => !pair.text)) {
      console.error("Por favor, preencha todos os campos.");
      return;
    }

    createQuestionMutation.mutateAsync(
      {
        text: description.text,
        type: description.type,
        points: "0",
        module_id: editingQuiz?.id?.toString() || "",
      },
      {
        onSuccess: (data: any) => {
          console.log("Pergunta criada com sucesso:", data);
          setDescription({
            id: "",
            text: "",
            points: "",
            module_id: editingQuiz?.id?.toString() || "",
            type: "pairs",
          });

          // Create answers for the newly created question
          answerPairs.forEach((pair) => {
            createAnswerMutation.mutateAsync(
              {
                text: pair.text,
                correct_order: pair.correct_order,
                isCorrect: pair.isCorrect,
                pair: pair.pair,
                question_id: data?.id,
              },
              {
                onSuccess: (answerData: any) => {
                  console.log("Resposta criada com sucesso:", answerData);
                },
                onError: (error) => {
                  console.error("Erro ao criar resposta:", error);
                },
              }
            );
          });

          // Reset the form after successful creation
          setAnswerPairs([
            {
              id: "1",
              text: "",
              isCorrect: 0,
              question_id: "",
              pair: "A1",
              correct_order: 0,
            },
            {
              id: "2",
              text: "",
              isCorrect: 0,
              question_id: "",
              pair: "B1",
              correct_order: 0,
            },
          ]);
        },
        onError: (error: unknown) => {
          console.error("Erro ao criar pergunta:", error);
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Criar Pares Correspondentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-[400px] overflow-y-scroll ">
          <div>
            <Label htmlFor="description">Descrição do Quiz</Label>
            <Textarea
              id="description"
              placeholder="Digite a descrição do quiz ou instruções aqui..."
              value={description.text}
              onChange={(e) =>
                setDescription({ ...description, text: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div className="space-y-4">
            {answerPairs.map((pair, index) => (
              <div key={pair.id} className="flex items-center space-x-2">
                <Label className="w-8">{index}</Label>
                <Input
                  placeholder={`Item da coluna ${
                    pair?.pair?.startsWith("A") ? "esquerda" : "direita"
                  }`}
                  value={pair.text}
                  onChange={(e) => updateAnswerPair(pair.id!, e.target.value)}
                  className="flex-1"
                />
                {index % 2 === 1 && index >= 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAnswerPair(answerPairs[index - 1].id!)}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={addAnswerPair} variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar mais pares
        </Button>
        <Button onClick={handleSubmit} className="bg-black text-white px-5">
          Criar pergunta
        </Button>
      </CardFooter>
    </Card>
  );
}
