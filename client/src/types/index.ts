export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  token: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: "active" | "archived";
  owner: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "To Do" | "In Progress" | "Complete";
  project: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
