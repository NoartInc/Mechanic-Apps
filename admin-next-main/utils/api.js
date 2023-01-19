import axios from "axios";
import store from "../store/store";
import { logout } from "../store/modules/auth";
import { Toast } from "./swal";

export const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:6001" // local laptop server
    : "http://localhost:6001";
// : "https://mechanic.transmetalroof.com:6001"; // server production

export const api = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  timeoutErrorMessage: "Server not responding",
});

export const get = async (url, params) => {
  try {
    const result = await api.get(url, { params });
    return Promise.resolve(result.data);
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

export const post = async (url, data = {}) => {
  try {
    const result = await api.post(url, data);
    return Promise.resolve(result.data);
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

export const put = async (url, data = {}) => {
  try {
    const result = await api.put(url, data);
    return Promise.resolve(result.data);
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

export const patch = async (url, data = {}) => {
  try {
    const result = await api.patch(url, data);
    return Promise.resolve(result.data);
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

export const destroy = async (url) => {
  try {
    const result = await api.delete(url);
    return Promise.resolve(result.data);
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

export const fileUpload = async (url, data, config) => {
  try {
    const result = await api({
      url: url,
      data: data,
      ...config,
    });
    return Promise.resolve(result.data);
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

api.interceptors.request.use(
  (req) => {
    const token = store.getState().auth.token;
    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      Toast.fire({
        icon: "error",
        text: "Mohon re-login kembali",
      }).then(() => {
        store.dispatch(logout());
      });
    }
    return Promise.reject(error);
  }
);
