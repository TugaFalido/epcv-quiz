import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadClient } from "./client/upload";
import { API_ENDPOINTS } from "./client/api-endpoints";

export const useUploadUserProfile = () => {
  return useMutation({
    mutationFn: (data: FormData) => uploadClient.profileImage(data),
  });
};

// Hook for uploading videos with multipart/form-data
export const useUploadVideo = () => {
  return useMutation({
    mutationFn: (data: FormData) => uploadClient.video(data),
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: (data: FormData) => uploadClient.image(data),

    onSuccess: (data, variables, context) => {
      // Boom baby!
      return data;
    },
  });
};

// Hook for fetching images by ID
export const useGetImage = () => {
  return useMutation({
    mutationFn: (imageId: string) => uploadClient.getImage(imageId),
  });
};

// Hook for fetching videos by ID
export const useGetVideo = () => {
  return useMutation({
    mutationFn: (videoId: string) => uploadClient.getVideo(videoId),
  });
};

export const useGetPresignedUrl = () => {
  return useMutation({
    mutationFn: (key: string) => uploadClient.getPresignedUrl(key),
  });
};

export const useGetPresignedUrlQuery = (key: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.UPLOAD.GET_PRESIGNED_URL, key],
    queryFn: () => uploadClient.getPresignedUrl(key),
    enabled: !!key, // This hook only runs if a content ID is provided
  });

  return {
    data,
    error,
    loading: isLoading,
  };
};
