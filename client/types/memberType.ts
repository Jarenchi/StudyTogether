export interface Member {
  _id: string;
  userId: string;
  clubId: string | null;
  name: string;
  picture: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
