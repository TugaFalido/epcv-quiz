import { QuestionType } from "@/lib/types";
import { DataHttpClient } from "@/services/data";

export const questionClient = {
  createQuestion: (data: Partial<QuestionType>) => {
    return DataHttpClient.post("/api/questions", data);
  },
  updateQuestion: (id: string, data: Partial<QuestionType>) => {
    return DataHttpClient.put(`/api/questions/${id}`, data);
  },
  deleteQuestion: (id: string) => {
    return DataHttpClient.delete(`/api/questions/${id}`);
  },
  listQuestions: (moduleId: string) => {
    return DataHttpClient.get<QuestionType[]>(`/api/questions/${moduleId}`);
  },
};
