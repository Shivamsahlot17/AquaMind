import api from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ENGINEER" | "VIEWER";
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
}