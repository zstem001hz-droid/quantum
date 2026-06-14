// Base user identity - returned when populating owner/member/assignedTo fields
export interface UserIdentity {
  _id: string;
  name: string;
  username: string;
  email: string;
}

// Full user — includes auth token and account fields, stored in AuthContext
export interface User extends UserIdentity {
  token: string;
  twoFactorEnabled?: boolean;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: "active" | "archived";
  owner: UserIdentity;
  members: UserIdentity[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "To Do" | "In Progress" | "Complete";
  project: string;
  owner: UserIdentity;
  assignedTo?: UserIdentity | null;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
