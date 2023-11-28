export interface Doc {
  creater: Creater;
  title: string;
  status: string;
  content: string;
  club: string;
  permissions: Permission[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Creater {
  id: string;
  name: string;
  picture: string;
}

export interface Permission {
  user: string;
  role: "read" | "write" | "owner";
}
