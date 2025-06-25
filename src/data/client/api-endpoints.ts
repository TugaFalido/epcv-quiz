import { answerAtom } from "@/store/data";

export const API_ENDPOINTS = {
  QUESTION: {
    CREATE: "/api/questions",
    UPDATE: "/api/questions/:id",
    DELETE: "/api/questions/:id",
    LIST: "/api/questions/:module_id",
    GET: "/api/questions/:id",

    INTRO: {
      CREATE: "/api/question_descriptions",
      BY_ID: "/api/question_descriptions/:id",
      UPDATE: "/api/question_descriptions/:id",
      DELETE: "/api/question_descriptions/:id",
      BY_QUESTION_ID: "/api/question_descriptions/:question_id",
    },
  },
  ANSWER: {
    CREATE: "/api/answers",
    UPDATE: "/api/answers/:id",
    DELETE: "/api/answers/:id",
    LIST: "/api/answers/:question_id",
    GET: "/api/answers/:id",
  },
  MODULE: {
    LIST: "/api/modules",
    CREATE: "/api/modules",
    UPDATE: "/api/modules/:id",
    DELETE: "/api/modules/:id",
    GET: "/api/modules/:id",

    DESCRIPTIONS: {
      CREATE: "/api/module_descriptions",
      BY_ID: "/api/module_descriptions/:id",
      UPDATE: "/api/module_descriptions/:id",
      DELETE: "/api/module_descriptions/:id",
      BY_MODULE_ID: "/api/module_descriptions/:module_id",
    },
  },

  UPLOAD: {
    UPLOAD_VIDEO_ALT: "/upload-image",
    UPLOAD_VIDEO: "api/upload-video",
    UPLOAD_IMAGE: "api/upload",
    UPLOAD_IMAGE_ALT: "/upload-image",
    GET_IMAGE: "get-image",
    GET_VIDEO: "get-image",
    GET_PRESIGNED_URL: "/s3/get-signed-url/{bucket}/{key}",
  },
};
