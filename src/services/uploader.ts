import { useUploadImage } from "@/data/upload";
import { useState } from "react";

const useImageUploader = () => {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const uploadImageMutation = useUploadImage();

  const uploadImage = async (image: File) => {
    setLoading(true);
    setError(null);
    try {
      if (image) {
        const imageFormData = new FormData();
        imageFormData.append("file", image);

        uploadImageMutation.mutate(imageFormData, {
          onSuccess: (data, variables, context) => {
            setLoading(false);
            return data;
          },
          onError: (error, variables, context) => {
            setLoading(false);
            setError(error);
          },
        });
      } else {
        setLoading(false);
        return void 0;
      }
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  return { image, setImage, uploadImage, loading, error };
};
