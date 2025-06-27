"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import SingleAnswerQuiz from "./subcomponents/quiztype/singleAnswer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRecoilState } from "recoil";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EditingQuizAtom, quizAtom } from "@/store/data";
import { QuestionType, QuizType } from "@/lib/types";
import { useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateModule, useUpdateModule } from "@/data/module";
import { useCreateQuestionDescription } from "@/data/question-descriptions";
import { useUploadImage } from "@/data/upload";

export default function EditQuiz({ changeEditToCreate, btnCaption }: any) {
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const [editingQuiz, setEditingQuiz] = useRecoilState<QuizType | null>(
    EditingQuizAtom
  );
  const [quizzes, setQuizzes] = useRecoilState<QuizType[] | null>(quizAtom);

  const [descriptions, setDescriptions] = useState<
    { description: string; image: File | null }[]
  >([{ description: "", image: null }]);

  const updateQuizMutation = useUpdateModule();
  const createQuizMutation = useCreateModule();
  const createDescriptionMutation = useCreateQuestionDescription();
  const imageUploadMutation = useUploadImage();

  const handleAddDescription = () => {
    setDescriptions([...descriptions, { description: "", image: null }]);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index].description = value;
    setDescriptions(newDescriptions);
  };

  const handleImageChange = (index: number, file: File | null) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index].image = file;
    setDescriptions(newDescriptions);
  };

  async function uploadImage(image: File) {
    return new Promise((resolve, reject) => {
      try {
        if (image) {
          const imageFormData = new FormData();
          imageFormData.append("file", image);
          // imageFormData.append("contentId", "test");

          imageUploadMutation.mutate(imageFormData, {
            onSuccess: (data, variables, context) => {
              resolve(data);
            },

            onError(error, variables, context) {
              console.log({ error });
            },
          });

          // resolve(void 0);
        } else {
          resolve(void 0);
        }
      } catch (error) {
        reject();
      }
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newQuiz: QuizType = {
      id: editingQuiz ? editingQuiz.id : Date.now(),
      name: formData.get("title") as string,
      description: formData.get("description") as string,
      time_limit: Number(formData.get("timeLimit")),
      approval_percentage: Number(formData.get("approvalPercentage")),
      disciplina: formData.get("disciplina") as string,
      ano: formData.get("ano") as string,
      module_reference: formData.get("moduleReference") as string,
      position: Number(formData.get("position")),
      next_block_link: formData.get("next_block_link") as string,
      previous_block_link: formData.get("previous_block_link") as string,
      //questions: [],
      type: formData.get("type") as string,
      image: "",
    };

    if (editingQuiz) {
      updateQuizMutation.mutate({
        module_id: editingQuiz.id?.toString(),
        data: newQuiz,
      });

      let descriptionsArr = [];

      for (const desc of descriptions) {
        if (desc.image) {
          const formData = new FormData();
          formData.append("file", desc.image);
          let imageResponse: any = await uploadImage(desc.image);

          console.log({ imageResponse });

          descriptionsArr.push({
            ...desc,
            image: imageResponse.data.file.location,
          });

          // if (desc.image && desc.description) {
          //   const descriptionData = {
          //     question_id: "343",
          //     text: "Your text here",
          //     type: "intro" as "intro" | "outro",
          //     image: imageResponse.data.file.location,
          //   };

          //   await createDescriptionMutation.mutateAsync(descriptionData);
          // }
        }
      }

      let dnewDesc = JSON.stringify(descriptionsArr);

      console.log({ dnewDesc });
    } else {
      // if (quizzes && quizzes?.length > 0) {
      //   quizzes && quizzes?.length > 0
      //     ? setQuizzes([...quizzes, newQuiz])
      //     : setQuizzes([newQuiz]);
      // } else {
      //   setQuizzes([newQuiz]);
      // }
      createQuizMutation.mutate(newQuiz);
    }
    //setEditingQuiz(null);
    dialogCloseRef.current?.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-black rounded-lg text-white p-3 px-10 py-3 text-lg" 
          onClick={changeEditToCreate}
        >
          {btnCaption}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white h-fit">
        <ScrollArea className="max-h-2/3 h-[600px]">
          <Card className="border-none">
            <CardHeader>
              <CardTitle>
                {editingQuiz ? "Editar Quiz" : "Criar Quiz"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Título do quiz"
                    defaultValue={editingQuiz?.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Descrição do quiz"
                    defaultValue={editingQuiz?.description}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="timeLimit">Tempo limite (minutos)</Label>
                  <Input
                    id="timeLimit"
                    name="timeLimit"
                    type="number"
                    placeholder="Tempo limite em minutos"
                    defaultValue={editingQuiz?.time_limit}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="approvalPercentage">
                    Percentagem de aprovação
                  </Label>
                  <Input
                    id="approvalPercentage"
                    name="approvalPercentage"
                    type="number"
                    placeholder="Percentagem mínima para aprovação"
                    defaultValue={editingQuiz?.approval_percentage}
                    required
                  />
                </div>
                <div>
                                  <Label htmlFor="disciplina">Disciplina</Label>
                                  <Input
                                    id="disciplina"
                                    name="disciplina"
                                    placeholder="Ex: Matemática"
                                    defaultValue={editingQuiz?.disciplina}
                                  />
                                </div>
                
                                <div>
                                  <Label htmlFor="ano">Ano</Label>
                                  <Input
                                    id="ano"
                                    name="ano"
                                    placeholder="Ex: 9º ano"
                                    defaultValue={editingQuiz?.ano}
                                  />
                                </div>
                <div>
                  <Label htmlFor="moduleReference">Módulo de referência</Label>
                  <Input
                    id="moduleReference"
                    name="moduleReference"
                    placeholder="Referencia ou nome do módulo"
                    defaultValue={editingQuiz?.module_reference}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="position">Posição no módulo</Label>
                  <Input
                    id="position"
                    name="position"
                    type="number"
                    placeholder="A posição onde será apresentado o quiz no módulo (1, 2, 3)"
                    defaultValue={editingQuiz?.position}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="position">Tipo</Label>
                  <Input
                    id="type"
                    name="type"
                    type="text"
                    placeholder="Tipo"
                    defaultValue={editingQuiz?.type}
                    // required
                  />
                </div>

                <div>
                  <Label htmlFor="position">Link bloco seguinte</Label>
                  <Input
                    id="next_block_link"
                    name="next_block_link"
                    type="text"
                    placeholder="Link bloco seguinte"
                    defaultValue={editingQuiz?.next_block_link}
                    // required
                  />
                </div>
                <div>
                  <Label htmlFor="position">Link do bloxo anterior</Label>
                  <Input
                    id="previous_block_link"
                    name="previous_block_link"
                    type="text"
                    placeholder="Link do bloxo anterior"
                    defaultValue={editingQuiz?.previous_block_link}
                    // required
                  />
                </div>

                {/* {descriptions.map((desc, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`description-${index}`}>
                      Intro {index + 1}
                    </Label>
                    <Textarea
                      id={`description-${index}`}
                      name={`description-${index}`}
                      placeholder="Descrição do quiz"
                      value={desc.description}
                      onChange={(e) =>
                        handleDescriptionChange(index, e.target.value)
                      }
                      required
                    />
                    <Label htmlFor={`image-${index}`}>Imagem {index + 1}</Label>
                    <Input
                      id={`image-${index}`}
                      name={`image-${index}`}
                      type="file"
                      onChange={(e) =>
                        handleImageChange(index, e.target.files?.[0] || null)
                      }
                      required
                    />
                  </div>
                ))} */}

                {/* <Button
                  type="button"
                  onClick={handleAddDescription}
                  className="bg-gray-300"
                >
                  + Adicionar Introdução
                </Button> */}

                <div className="flex justify-start gap-5">
                  <Button type="submit" className="bg-black text-white">
                    {editingQuiz ? "Atualizar Quiz" : "Criar Quiz"}
                  </Button>

                  <DialogClose
                    ref={dialogCloseRef}
                    className=" text-black rounded-md border px-5"
                  >
                    Cancelar
                  </DialogClose>
                </div>
              </form>
            </CardContent>
          </Card>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
