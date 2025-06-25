import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ModuleDescriptionClient } from "./client/module-description";
import { API_ENDPOINTS } from "./client/api-endpoints";
import { toast } from "sonner";

// Hook to get module description by module_id
export const useModuleDescriptionByModuleId = (module_id: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.MODULE.DESCRIPTIONS.BY_MODULE_ID, module_id],
    queryFn: () => ModuleDescriptionClient.get_by_module_id(module_id),
  });

  return {
    data,
    error,
    loading: isLoading,
  };
};

// Hook to get module description by id
export const useModuleDescriptionById = (id: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.MODULE.DESCRIPTIONS.BY_ID, id],
    queryFn: () => ModuleDescriptionClient.get_by_id(id),
  });

  return {
    data,
    error,
    loading: isLoading,
  };
};

// Hook to create a module description
export const useCreateModuleDescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => ModuleDescriptionClient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.MODULE.DESCRIPTIONS.BY_MODULE_ID],
      });
    },
  });
};

// Hook to update a module description
export const useUpdateModuleDescription = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => ModuleDescriptionClient.update(id, data),
    onSuccess: (data, variables, context) => {
      console.log({id})
      console.log({ data });
      toast.success("Conclusão atualizada com sucesso");
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.MODULE.DESCRIPTIONS.BY_ID, id],
      });
    },
  });
};

// Hook to delete a module description
export const useDeleteModuleDescription = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ModuleDescriptionClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.MODULE.DESCRIPTIONS.BY_MODULE_ID],
      });
    },
  });
};
