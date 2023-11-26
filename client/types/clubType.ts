export interface Club {
  owner: Owner;
  _id: string;
  name: string;
  description: string;
  picture: string;
  members: Member[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Owner {
  id: string;
  name: string;
  picture: string;
}

export interface Member {
  id: string;
  name: string;
  picture: string;
}
