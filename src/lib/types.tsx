import { z } from "zod";

const Answer = z.object({
  id: z.string().optional(),
  text: z.string(),
  isCorrect: z.number(),
  question_id: z.string(),
  correct_order: z.number().optional(),
  pair: z.string().optional().nullable(),
  nextQuestionId: z.string().optional(),
  info: z.string().optional(),
});

const Question = z.object({
  id: z.string(),
  text: z.string(),
  points: z.string(), // If points should be a number, use z.number()
  module_id: z.string(),
  type: z.string(),
  //   answers: z.array(Answer), // If your questions have answers
});

const Quiz = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  time_limit: z.number(),
  approval_percentage: z.number(),
  image: z.string(),
  module_reference: z.string(),
  position: z.number(),
  next_block_link: z.string().optional(),
  previous_block_link: z.string().optional(),
  type: z.string().optional(),

  // questions: z.array(Question),
});

export const AnswerFormSchema = z.object({
  isCorrect: z.number(),
  text: z.string(),
  question_id: z.string(),
  correct_order: z.number().optional(),
  pair: z.string().optional().nullable(),
  info: z.string().optional().nullable(),
});

export const DnDQuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  words: z.array(z.string()),
  correctOrder: z.array(z.number()),
});

// Define the schema for QuestionDescription
export const QuestionDescriptionSchema = z.object({
  id: z.string().optional(), // Unique identifier for the description
  text: z.string(), // The text of the description
  question_id: z.string(), // The ID of the associated question
  type: z.enum(["intro", "outro"]), // The type of the description
  // image: z.string().optional(), // Optional image URL associated with the description
  successText: z.string().optional(),
  failureText: z.string().optional(),
  image: z.any(),
});

export const ModuleDescriptionSchema = z.object({
  text: z.string(),
  module_id: z.string(),
  type: z.string(),
  image: z.string(),
});

export const ModuleOutroDescriptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  module_id: z.string(),
  type: z.string(),
  image: z.string(),
});

export interface LTIData {
  user_id: string;
  context_id: string;
  roles: string;
  lis_person_name_full: string;
  lis_outcome_service_url: string;
  lis_result_sourcedid: string;
  custom_params: Record<string, string>;
}

export type QuestionType = z.infer<typeof Question>;
export type AnswerType = z.infer<typeof Answer>;
export type QuizType = z.infer<typeof Quiz>;
export type AnswerFormType = z.infer<typeof AnswerFormSchema>;
export type DnDQuestionType = z.infer<typeof DnDQuestionSchema>;
// Infer the TypeScript type from the schema
export type QuestionDescriptionType = z.infer<typeof QuestionDescriptionSchema>;
export type ModuleDescriptionType = z.infer<typeof ModuleDescriptionSchema>;
export type ModuleOutroDescriptionType = z.infer<
  typeof ModuleOutroDescriptionSchema
>;
