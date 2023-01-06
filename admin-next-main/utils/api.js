import axios from "axios";

const baseUrl =
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

export const destroy = async (url) => {
  try {
    const result = await api.delete(url);
    return Promise.resolve(result.data);
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};
