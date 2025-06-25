import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { moduleClient } from "./client/module";
import { API_ENDPOINTS } from "./client/api-endpoints";
import { QuizType } from "@/lib/types";

// Hook to list all modules
export const useListModules = () => {
  return useQuery<QuizType[]>({
    queryKey: ["modules"],
    queryFn: moduleClient.listModules,
    staleTime: 5000, // Adjust based on your application needs
  });
};

// Hook to create a new module
export const useCreateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: moduleClient.createModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] }); // Refresh the list of modules after creation
    },
  });
};

// Hook to get a module by ID
export const useGetModule = (moduleId: string) => {
  return useQuery<QuizType, Error>({
    queryKey: [API_ENDPOINTS.MODULE.GET, moduleId],
    queryFn: () => moduleClient.getModuleById(moduleId),
    enabled: !!moduleId, // Ensures the query runs only if moduleId is truthy
  });
};

// Hook to update a module
export const useUpdateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ module_id, data }: { module_id: string; data: QuizType }) =>
      moduleClient.updateModule(module_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] }); // Refresh the list of modules after update
    },
  });
};

// Hook to delete a module
export const useDeleteModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => moduleClient.deleteModule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] }); // Update the list after deleting a module
    },
  });
};
