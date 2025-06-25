import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QuestionType } from "@/lib/types";
import Image from "next/image";
import { DialogContent } from "@/components/ui/dialog";
import {
  useCreateQuestionDescription,
  useListQuestionDescriptionsByQuestionId,
  useUpdateQuestionDescription,
} from "@/data/question-descriptions";
import { useUploadImage } from "@/data/upload";
import { Loader2 } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const introSchema = z.object({
  text: z.string().min(1, "Dialog content is required"),
  image: z
    .instanceof(File)

    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .nullable(),
  question_id: z.string(),
});

const outroSchema = introSchema.extend({
  successText: z.string().min(1, "Success text is required"),
  failureText: z.string().min(1, "Failure text is required"),
});

type introType = z.infer<typeof introSchema>;
type outroType = z.infer<typeof outroSchema>;

const IntroOutroContent = ({ question }: { question: QuestionType }) => {
  const [activeTab, setActiveTab] = useState("intro");
  const [introImagePreview, setIntroImagePreview] = useState<string | null>(
    null
  );
  const [outroImagePreview, setOutroImagePreview] = useState<string | null>(
    null
  );

  const { data: descriptions, isLoading: isLoadingDescriptions } =
    useListQuestionDescriptionsByQuestionId(question.id?.toString() || "");
  const createDescription = useCreateQuestionDescription();
  const updateDescription = useUpdateQuestionDescription();
  const imageUploadMutation = useUploadImage();

  const introForm = useForm<introType>({
    resolver: zodResolver(introSchema),
    defaultValues: {
      text: "",
      question_id: question?.id?.toString(),
    },
  });

  const outroForm = useForm<outroType>({
    resolver: zodResolver(outroSchema),
    defaultValues: {
      text: "",
      question_id: question?.id?.toString(),
      successText: "",
      failureText: "",
    },
  });

  useEffect(() => {
    if (descriptions) {
      const introDesc = descriptions.find((desc) => desc.type === "intro");
      const outroDesc = descriptions.find((desc) => desc.type === "outro");

      if (introDesc) {
        introForm.reset({
          text: introDesc.text,
          question_id: introDesc.question_id,
        });
        setIntroImagePreview(introDesc.image || null);
      }

      if (outroDesc) {
        outroForm.reset({
          text: outroDesc.text,
          question_id: outroDesc.question_id,
          successText: outroDesc.successText || "",
          failureText: outroDesc.failureText || "",
        });
        setOutroImagePreview(outroDesc.image || null);
      }
    }
  }, [descriptions, introForm, outroForm]);

  const handleImageChange = (e: any, setImagePreview: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function uploadImage(image: File) {
    return new Promise((resolve, reject) => {
      try {
        if (image) {
          const imageFormData = new FormData();
          imageFormData.append("image", image);
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

  const onIntroSubmit = async (data: introType) => {
    let imageUrl = introImagePreview || "";
    if (data.image instanceof File) {
      const imageResponse: any = await uploadImage(data.image);
      imageUrl = imageResponse?.data?.file?.location;
    }

    const descriptionData = {
      text: data.text,
      question_id: question.id?.toString() || "",
      image: imageUrl,
      type: "intro" as const,
    };

    const existingIntro = descriptions?.find((desc) => desc.type === "intro");
    if (existingIntro && existingIntro?.id) {
      await updateDescription.mutateAsync({
        description_id: existingIntro.id,
        data: descriptionData,
      });
    } else {
      await createDescription.mutateAsync(descriptionData, {
        onSuccess(data, variables, context) {
          introForm.reset();
        },
      });
    }
  };

  const onOutroSubmit = async (data: outroType) => {
    let imageUrl = outroImagePreview;
    if (data.image instanceof File) {
      const imageResponse: any = await uploadImage(data.image);
      imageUrl = imageResponse?.data?.file?.location;
    }

    const descriptionData = {
      text: data.text,
      question_id: question.id?.toString() || "",
      image: imageUrl,
      successText: data.successText,
      failureText: data.failureText,
      type: "outro" as const,
    };

    const existingOutro = descriptions?.find((desc) => desc.type === "outro");
    if (existingOutro && existingOutro?.id) {
      await updateDescription.mutateAsync({
        description_id: existingOutro.id,
        data: descriptionData,
      });
    } else {
      await createDescription.mutateAsync(descriptionData, {
        onSuccess(data, variables, context) {
          outroForm.reset();
        },
      });
    }
  };

  if (isLoadingDescriptions) {
    return <div>Loading...</div>;
  }

  console.log({ descriptions });

  return (
    <DialogContent>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="intro"
            className="data-[state=active]:shadow-md data-[state=active]:rounded-tabs data-[state=active]:border data-[state=active]:border-black"
          >
            Intro
          </TabsTrigger>
          <TabsTrigger
            value="outro"
            className="data-[state=active]:shadow-md data-[state=active]:rounded-tabs data-[state=active]:border data-[state=active]:border-black"
          >
            Outro
          </TabsTrigger>
        </TabsList>
        <TabsContent value="intro">
          <Card>
            <CardHeader>
              <CardTitle>Intro Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={introForm.handleSubmit(onIntroSubmit)}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="introDialogContent">Description</Label>
                    <Controller
                      name="text"
                      control={introForm.control}
                      render={({ field }) => (
                        <Textarea
                          id="introDialogContent"
                          {...field}
                          placeholder="Enter intro dialog content"
                        />
                      )}
                    />
                    {introForm.formState.errors.text && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {introForm.formState.errors.text.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="introImage">Image</Label>
                    <Input
                      id="introImage"
                      type="file"
                      accept="image/*"
                      //register("image")
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0 && files?.[0] !== null) {
                          introForm.setValue("image", files[0]); // Remove null type
                          handleImageChange(e, setIntroImagePreview);
                        }
                      }}
                    />
                    {introForm.formState.errors.image && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {introForm.formState.errors.image.message}
                        </AlertDescription>
                      </Alert>
                    )}
                    {introImagePreview && (
                      <div className="mt-2">
                        <Image
                          height={100}
                          width={100}
                          src={introImagePreview}
                          alt="Preview"
                          className="max-w-full h-auto max-h-48 object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="bg-edit-button text-white"
                    disabled={
                      imageUploadMutation.isPending ||
                      createDescription.isPending ||
                      updateDescription.isPending
                    }
                  >
                    {(imageUploadMutation.isPending ||
                      createDescription.isPending ||
                      updateDescription.isPending) && (
                      <Loader2 className="animate-spin text-white w-10 h-10 mr-2" />
                    )}
                    Save Intro
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="outro">
          <Card>
            <CardHeader>
              <CardTitle>Outro Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={outroForm.handleSubmit(onOutroSubmit)}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="outroDialogContent">Description</Label>
                    <Controller
                      name="text"
                      control={outroForm.control}
                      render={({ field }) => (
                        <Textarea
                          id="outroDialogContent"
                          {...field}
                          placeholder="Enter outro dialog content"
                        />
                      )}
                    />
                    {outroForm.formState.errors.text && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {outroForm.formState.errors.text.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="outroImage">Image</Label>
                    <Input
                      id="outroImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files; // Store files in a variable
                        if (files && files.length > 0) {
                          // Check if files is not null and has at least one file
                          const file = files[0];
                          if (file !== null)
                            outroForm.setValue("image", file as File); // Cast file to File type
                          handleImageChange(e, setOutroImagePreview);
                        }
                      }}
                    />
                    {outroForm.formState.errors.image && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {outroForm.formState.errors.image.message}
                        </AlertDescription>
                      </Alert>
                    )}
                    {outroImagePreview && (
                      <div className="mt-2">
                        <img
                          src={outroImagePreview}
                          alt="Preview"
                          className="max-w-full h-auto max-h-48 object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="outroSuccessText">Success Text</Label>
                    <Controller
                      name="successText"
                      control={outroForm.control}
                      render={({ field }) => (
                        <Input
                          id="outroSuccessText"
                          {...field}
                          placeholder="Enter success text"
                        />
                      )}
                    />
                    {outroForm.formState.errors.successText && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {outroForm.formState.errors.successText.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="outroFailureText">Failure Text</Label>
                    <Controller
                      name="failureText"
                      control={outroForm.control}
                      render={({ field }) => (
                        <Input
                          id="outroFailureText"
                          {...field}
                          placeholder="Enter failure text"
                        />
                      )}
                    />
                    {outroForm.formState.errors.failureText && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {outroForm.formState.errors.failureText.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="bg-edit-button text-white"
                    disabled={
                      imageUploadMutation.isPending ||
                      createDescription.isPending ||
                      updateDescription.isPending
                    }
                  >
                    {(imageUploadMutation.isPending ||
                      createDescription.isPending ||
                      updateDescription.isPending) && (
                      <Loader2 className="animate-spin text-white w-10 h-10 mr-2" />
                    )}
                    Save Outro
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default IntroOutroContent;
