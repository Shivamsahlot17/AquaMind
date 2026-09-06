import api from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ENGINEER" | "VIEWER";
  createdAt: string;
  updatedAt: string;
}

export async function getUsers(): Promise<User[]> {
  const response = await api.get("/users");

  return response.data.users;
}

export async function updateUserRole(
  userId: string,
  role: "ADMIN" | "ENGINEER" | "VIEWER"
): Promise<User> {
  const response = await api.patch(`/users/${userId}/role`, {
    role,
  });

  return response.data.user;
}

export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/users/${userId}`);
}