import axios from "axios";
import { BACKEND_API } from "../Backend_API.js";

// Register a new user
export const registerUser = async (formData) => {
  const response = await axios.post(`${BACKEND_API}/api/users/register`, formData);
  return response.data;
};

// Login a user
export const loginUser = async (credentials) => {
  const response = await axios.post(`${BACKEND_API}/api/users/login`, credentials, {
    withCredentials: true,
  });
  return response.data;
};

// Logout the user
export const logoutUser = async () => {
  const response = await axios.post(
    `${BACKEND_API}/api/users/logout`,
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
    `${BACKEND_API}/api/users/refresh-token`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};
