import { DataHttpClient } from "@/services/data";
import { API_ENDPOINTS } from "./api-endpoints";
import { ModuleDescriptionType } from "@/lib/types";

export const ModuleDescriptionClient = {
  get_by_module_id: (module_id: string) => {
    return DataHttpClient.get<ModuleDescriptionType[]>(
      API_ENDPOINTS.MODULE.DESCRIPTIONS.BY_MODULE_ID.replace(
        ":module_id",
        module_id
      )
    );
  },

  get_by_id: (id: string) => {
    return DataHttpClient.get<ModuleDescriptionType>(
      API_ENDPOINTS.MODULE.DESCRIPTIONS.BY_ID.replace(":id", id)
    );
  },

  create: (data: any) => {
    return DataHttpClient.post(API_ENDPOINTS.MODULE.DESCRIPTIONS.CREATE, data);
  },

  update: (id: string, data: any) => {
    return DataHttpClient.put(
      API_ENDPOINTS.MODULE.DESCRIPTIONS.UPDATE.replace(":id", id),
      data
    );
  },

  delete: (id: string) => {
    return DataHttpClient.delete(
      API_ENDPOINTS.MODULE.DESCRIPTIONS.DELETE.replace(":id", id)
    );
  },
};
