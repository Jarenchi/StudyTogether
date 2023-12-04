export interface Club {
  owner: Owner;
  _id: string;
  name: string;
  description: string;
  picture: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Owner {
  id: string;
  name: string;
  picture: string;
}
