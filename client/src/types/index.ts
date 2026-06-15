// Base user identity - returned when populating owner/member/assignedTo fields
export interface UserIdentity {
  _id: string;
  name: string;
  username: string;
  email: string;
}

// Full user — account fields stored in AuthContext; auth token lives in an httpOnly cookie, never exposed to JS
export interface User extends UserIdentity {
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
