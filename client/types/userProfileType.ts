export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  picture: string;
  points: number;
  clubs: Club[];
  events: Event[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Club {
  owner: Owner;
  _id: string;
  name: string;
  description: string;
  picture: any;
  members: string[];
  docs: any[];
  events: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Owner {
  name: string;
  picture: string;
}

export interface Event {
  creator: Creator;
  _id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  location: string;
  maxPhysicalParticipants: number;
  clubId: ClubId;
  physicalParticipants: any[];
  onlineParticipants: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Creator {
  userId: string;
  name: string;
  picture: string;
}

export interface ClubId {
  owner: Owner2;
  _id: string;
  name: string;
  description: string;
  picture: string | null;
  members: string[];
  docs: string[];
  events: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Owner2 {
  name: string;
  picture: string;
}
