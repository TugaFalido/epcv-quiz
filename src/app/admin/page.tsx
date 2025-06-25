import GameList from "@/components/creator/gamelist";
import QACreator from "@/components/creator/qa";
import QuizList from "@/components/creator/quizlist";
import DNDQuestionCreator from "@/components/creator/subcomponents/quiztype/dnd_question";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <div className="w-full py-10 px-4">
      <Tabs defaultValue="quiz">
        <TabsList
          defaultValue="quiz"
          className="w-full flex gap-10 justify-start"
        >
          <TabsTrigger
            value="quiz"
            className="rounded-xl px-5 py-3 text-xl font-bold bg-white text-black data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Gestor de Quiz
          </TabsTrigger>
          <TabsTrigger
            value="games"
            className="rounded-xl px-5 py-3 text-xl font-bold bg-white text-black data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Gestor de Jogos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="quiz">
          <QuizList />
        </TabsContent>
        <TabsContent value="games">
          <GameList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
