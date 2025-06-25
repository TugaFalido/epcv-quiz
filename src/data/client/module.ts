import { QuizType } from "@/lib/types";
import { DataHttpClient } from "@/services/data";
import { API_ENDPOINTS } from "./api-endpoints";

export const moduleClient = {
  listModules: () => {
    return DataHttpClient.get<QuizType[]>("/api/modules");
  },
  createModule: (data: QuizType) => {
    return DataHttpClient.post("/api/modules", data);
  },

  // Function to get a module by ID
  getModuleById: (id: string): Promise<QuizType> => {
    const url = API_ENDPOINTS.MODULE.GET.replace(":id", id);
    return DataHttpClient.get(url);
  },

  updateModule: (id: string, data: QuizType) => {
    return DataHttpClient.put(`/api/modules/${id}`, data);
  },
  deleteModule: (id: string) => {
    return DataHttpClient.delete(`/api/modules/${id}`);
  },
};
