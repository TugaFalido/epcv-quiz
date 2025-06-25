"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import SingleAnswerQuiz from "./subcomponents/quiztype/singleAnswer";

export default function EditQuiz() {
  return (
    <Tabs>
      <TabsList>
        <TabsTrigger value="single-answer">
          <Button>Single Answer</Button>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="single-answer">
        <SingleAnswerQuiz />
      </TabsContent>
    </Tabs>
  );
}
