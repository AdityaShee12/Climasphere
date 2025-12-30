import axios from "axios";
import { API } from "../BackendApi.js";

// Register a new user
export const registerUser = async (formData) => {
  const response = await axios.post(`${API}/api/weather/register`, formData);
  return response.data;
};

// Login a user
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API}/api/weather/login`, credentials, {
    withCredentials: true,
  });
  return response.data;
};

// Logout the user
export const logoutUser = async () => {
  const response = await axios.post(
    `${API}/api/weather/logout`,
    {},
    {
      withCredentials: true,
    }
  );
  console.log("res", response);
  return response.data;
};

// Refresh the access token
export const refreshAccessToken = async () => {
  const response = await axios.post(
    `${API}/api/weather/refresh-token`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};
