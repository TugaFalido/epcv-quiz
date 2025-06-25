import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { questionDescriptionClient } from "./client/question-descriptions";
import { QuestionDescriptionType } from "@/lib/types"; // Adjust the import based on your types

// Hook to list all descriptions for a given question
export const useListQuestionDescriptions = (questionId: string) => {
  return useQuery<QuestionDescriptionType[]>({
    queryKey: ["questionDescriptions", questionId],
    queryFn: () => questionDescriptionClient.listDescriptions(questionId),
    enabled: !!questionId, // Only fetch when questionId is provided
  });
};

// New hook to list descriptions by question ID
export const useListQuestionDescriptionsByQuestionId = (questionId: string) => {
  return useQuery<QuestionDescriptionType[]>({
    queryKey: ["questionDescriptionsByQuestionId", questionId],
    queryFn: () => questionDescriptionClient.listDescriptionsByQuestionId(questionId),
    enabled: !!questionId, // Only fetch when questionId is provided
  });
};

// Hook to create a new question description
export const useCreateQuestionDescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: questionDescriptionClient.createDescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionDescriptions"] }); // Refresh the list of descriptions after creation
    },
  });
};

// Hook to update a question description
export const useUpdateQuestionDescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      description_id,
      data,
    }: {
      description_id: string;
      data: QuestionDescriptionType;
    }) => questionDescriptionClient.updateDescription(description_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionDescriptions"] }); // Refresh the list of descriptions after update
    },
  });
};

// Hook to delete a question description
export const useDeleteQuestionDescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionDescriptionClient.deleteDescription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionDescriptions"] }); // Update the list after deleting a description
    },
  });
};
