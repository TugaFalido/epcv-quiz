import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { EditingQuestionAtom, EditingQuizAtom } from "@/store/data";
import { toast } from "sonner";
import { PlusIcon } from "@/assets/icons/plus-icon";
import { useEffect, useRef, useState } from "react";
import { AnswerType, QuestionType } from "@/lib/types";
import { useCreateQuestion, useUpdateQuestion } from "@/data/question";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useListAnswers, useUpdateAnswer } from "@/data/answer";
import { Loader2, X } from "lucide-react";
import { QueryClient } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CoESingleAnswer from "./quiztype/CoESingleAnswer";
import CorrespondingPairs from "./quiztype/correpondingPairs";
import { ScrollArea } from "@/components/ui/scroll-area";
import DndQuestion from "@/components/creator/subcomponents/quiztype/dnd_question";
import CoEMultipleAnswer from "./quiztype/CoEMultipleAnswer";

const queryClient = new QueryClient();

export function CoEQuestion() {
  const editingQuiz = useRecoilValue(EditingQuizAtom);
  const [editingQuestion, setEditingQuestion] =
    useRecoilState<QuestionType | null>(EditingQuestionAtom);

    

  return (
    <DialogContent className="w-full min-w-[50vw] bg-white">
      <DialogHeader>
        <DialogTitle>
          {editingQuestion ? "Editar Pergunta" : "Adicionar nova pergunta"}
        </DialogTitle>
      </DialogHeader>
      <DialogDescription className="">
        <Tabs defaultValue="single-answer" className="w-full flex flex-col gap-5">
          <TabsList className="flex justify-between gap-5 w-full ">
            <div className="w-fit flex overflow-x-scroll gap-3">
              <TabsTrigger value="single-answer" className="p-3 data-[state=active]:border-b-black data-[state=active]:border-b-2 data-[state=active]:text-black rounded-lg">Single Answer</TabsTrigger>
              <TabsTrigger value="multiple-answer" className="p-3 data-[state=active]:border-b-black data-[state=active]:border-b-2 data-[state=active]:text-black rounded-lg" >Multiple Answer</TabsTrigger>
              <TabsTrigger value="dnd" className="p-3 data-[state=active]:border-b-black data-[state=active]:border-b-2 data-[state=active]:text-black rounded-lg">Drag n Drop</TabsTrigger>
              <TabsTrigger value="corresponding-pairs" className="p-3 data-[state=active]:border-b-black data-[state=active]:border-b-2 data-[state=active]:text-black rounded-lg">
                Corresponding pair
              </TabsTrigger>
            </div>
          </TabsList>
          <TabsContent value="single-answer">
            <CoESingleAnswer />
          </TabsContent>
          <TabsContent value="multiple-answer">
            <CoEMultipleAnswer />
          </TabsContent>
          <TabsContent value="dnd">
            <DndQuestion />
          </TabsContent>
          <TabsContent value="corresponding-pairs">
            <CorrespondingPairs />
          </TabsContent>
        </Tabs>
      </DialogDescription>
    </DialogContent>
  );
}
