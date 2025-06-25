/* import { ApolloClient, InMemoryCache } from '@apollo/client';

const dataApi = new ApolloClient({
  uri: 'https://apifront.cvbapp.com/graphql',
  cache: new InMemoryCache(),
});

export default dataApi; */

import axios from "axios";


const dataApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DATA_API_URL}/`,
  // baseURL: "http://localhost:5280/"
});

// const cockie = parseCookies();
// const userData: any = cockie["tk_userAdmin"]
//   ? JSON.parse(cockie["tk_userAdmin"])
//   : null;
// // const token = userData?.token ? userData["token"] : null;
// console.log({ userData });

// dataApi.defaults.headers.common.Authorization = `Bearer ${userData}`;

// dataApi.interceptors.request.use(
//   (config) => {
//     const cockie = parseCookies();
//     const token: any = cockie["pd_userAdmin"]
//       ? JSON.parse(cockie["pd_userAdmin"])
//       : null;
//     if (token) {
//       config.headers["x-auth-token"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// dataApi.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       (error.response.status === 401 ||
//         error.response?.data?.msg === "Token is not valid") &&
//       !originalRequest._retry
//     ) {
//       console.log({ error });

//       destroyCookie(undefined, "tk_userAdmin");
//       console.log("destroy cookies");

//       if (typeof window !== "undefined") window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   }
// );

export class DataHttpClient {
  static async get<T>(url: string, params?: unknown) {
    const response = await dataApi.get<T>(url, { params });
    return response.data;
  }

  static async post<T>(url: string, data: unknown, options?: any) {
    const response = await dataApi.post<T>(url, data, options);
    return response.data;
  }

  static async put<T>(url: string, data: unknown) {
    const response = await dataApi.put<T>(url, data);
    return response.data;
  }

  static async delete<T>(url: string) {
    const response = await dataApi.delete<T>(url);
    return response.data;
  }
}

export { dataApi };
