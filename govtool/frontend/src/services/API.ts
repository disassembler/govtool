import axios from "axios";

import { PATHS } from "@consts";

const TIMEOUT_IN_SECONDS = 30 * 1000; // 1000 ms is 1 s then its 10 s
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const API = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_IN_SECONDS,
});

export const SetupInterceptors = (navigate: any) =>
  API.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error?.response?.status === 500) {
        navigate(PATHS.error, { state: { errorCode: 500 } });
      }

      return Promise.reject(error);
    }
  );