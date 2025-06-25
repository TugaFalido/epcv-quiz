import { DataHttpClient } from "@/services/data";
import { API_ENDPOINTS } from "./api-endpoints";
import { QuestionDescriptionType } from "@/lib/types"; // Adjust the import based on your types

export const questionDescriptionClient = {
  createDescription: async (data: Partial<QuestionDescriptionType>) => {
    return await DataHttpClient.post<QuestionDescriptionType>(
      API_ENDPOINTS.QUESTION.INTRO.CREATE,
      data
    );
  },

  updateDescription: async (id: string, data: QuestionDescriptionType) => {
    return await DataHttpClient.put<QuestionDescriptionType>(
      API_ENDPOINTS.QUESTION.INTRO.UPDATE.replace(":id", id),
      data
    );
  },

  deleteDescription: async (id: string) => {
    return await DataHttpClient.delete<void>(
      API_ENDPOINTS.QUESTION.INTRO.DELETE.replace(":id", id)
    );
  },

  listDescriptions: async (questionId: string) => {
    return await DataHttpClient.get<QuestionDescriptionType[]>(
      API_ENDPOINTS.QUESTION.INTRO.BY_QUESTION_ID.replace(
        ":question_id",
        questionId
      )
    );
  },

  // New method to list descriptions by question ID
  listDescriptionsByQuestionId: async (questionId: string) => {
    return await DataHttpClient.get<QuestionDescriptionType[]>(
      API_ENDPOINTS.QUESTION.INTRO.BY_QUESTION_ID.replace(
        ":question_id",
        questionId
      )
    );
  },
};
