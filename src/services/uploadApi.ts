import { useState } from "react";

import axios from "axios";


let uploadApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_UPLOAD_API_URL}`,
});

// const cockie = parseCookies();
// const userData: any = cockie["userAdmin"]
//   ? JSON.parse(cockie["userAdmin"])
//   : null;
// const token = userData?.accessToken ? userData["accessToken"] : null;

// uploadApi.defaults.headers.common.Authorization = `Bearer ${token}`;

// uploadApi.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       // destroyCookie(undefined, "userAdmin")
//       // if (typeof window !== 'undefined') window.location.href = '/login'
//     }
//   }
// );

export { uploadApi };
