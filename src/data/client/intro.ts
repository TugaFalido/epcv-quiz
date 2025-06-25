import { DataHttpClient } from "@/services/data";
import { API_ENDPOINTS } from "./api-endpoints";
import { AnswerFormType, AnswerType } from "@/lib/types";

export const answerClient = {
  listAnswers: (questionId: string) => {
    return DataHttpClient.get<AnswerType[]>(
      API_ENDPOINTS.ANSWER.LIST.replace(":question_id", questionId)
    );
  },
  createAnswer: (data: AnswerFormType) => {
    return DataHttpClient.post(API_ENDPOINTS.ANSWER.CREATE, data);
  },
  updateAnswer: (id: string, data: AnswerFormType) => {
    return DataHttpClient.put(
      API_ENDPOINTS.ANSWER.UPDATE.replace(":id", id),
      data
    );
  },
  deleteAnswer: (id: string) => {
    return DataHttpClient.delete(
      API_ENDPOINTS.ANSWER.DELETE.replace(":id", id)
    );
  },
};
