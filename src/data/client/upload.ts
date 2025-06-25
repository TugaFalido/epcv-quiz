import { uploadApi } from "@/services/uploadApi";
import { API_ENDPOINTS } from "./api-endpoints";

export const uploadClient = {
  // profileImage: (data: FormData) => {
  //   return DataHttpClient.post(API_ENDPOINTS.UPLOAD.UPLOAD_IMAGE, data);
  // },
  // Upload profile image
  profileImage: (data: FormData) => {
    return uploadApi.post(API_ENDPOINTS.UPLOAD.UPLOAD_IMAGE, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Upload video
  image: (data: FormData) => {
    return uploadApi.post(API_ENDPOINTS.UPLOAD.UPLOAD_IMAGE, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  video: (data: FormData) => {
    return uploadApi.post(API_ENDPOINTS.UPLOAD.UPLOAD_VIDEO, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Get image by ID
  getImage: (imageId: string) => {
    return uploadApi.get(`${API_ENDPOINTS.UPLOAD.GET_IMAGE}/${imageId}`);
  },

  // Get video by ID
  getVideo: (videoId: string) => {
    return uploadApi.get(`${API_ENDPOINTS.UPLOAD.GET_VIDEO}/${videoId}`);
  },

  getPresignedUrl: (key: string) => {
    return uploadApi.get(
      API_ENDPOINTS.UPLOAD.GET_PRESIGNED_URL.replace(
        "{bucket}",
        process.env.NEXT_PUBLIC_BUCKET!
      ).replace("{key}", key)
    );
  },
};
