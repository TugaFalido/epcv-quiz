import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { answerClient } from "./client/answer";
import { API_ENDPOINTS } from "./client/api-endpoints";
import { AnswerFormType, AnswerType } from "@/lib/types";

// Hook to list all answers for a given question
export const useListAnswers = (questionId: string) => {
  return useQuery<AnswerType[]>({
    queryKey: ["answers", questionId],
    queryFn: () => answerClient.listAnswers(questionId),
    enabled: !!questionId, // Only fetch when questionId is provided
    
  });
};

// Hook to create a new answer
export const useCreateAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: answerClient.createAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["answers"] }); // Refresh the list of answers after creation
    },
  });
};

// Hook to update an answer
export const useUpdateAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      answer_id,
      data,
    }: {
      answer_id: string;
      data: AnswerFormType;
    }) => answerClient.updateAnswer(answer_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["answers"] }); // Refresh the list of answers after update
    },
  });
};

// Hook to delete an answer
export const useDeleteAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => answerClient.deleteAnswer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["answers"] }); // Update the list after deleting an answer
    },
  });
};
