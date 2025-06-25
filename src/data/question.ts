import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { questionClient } from "./client/question";
import { API_ENDPOINTS } from "./client/api-endpoints";
import { QuestionType } from "@/lib/types";

// Hook to list questions for a given module
export const useListQuestions = (moduleId: string) => {
  return useQuery<QuestionType[]>({
    queryKey: ["questions", moduleId],
    queryFn: () => questionClient.listQuestions(moduleId),
    enabled: !!moduleId, // Only fetch when moduleId is available
  });
};

// Hook to create a new question
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: questionClient.createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] }); // Invalidate all queries for questions to refresh the data
    },
  });
};

// Hook to update a question
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      question_id,
      data,
    }: {
      question_id: string;
      data: QuestionType;
    }) => questionClient.updateQuestion(question_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] }); // Refresh the list after a successful update
    },
  });
};

// Hook to delete a question
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionClient.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] }); // Ensure the list is updated post deletion
    },
  });
};
