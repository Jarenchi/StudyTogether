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
  clubId: string;
  physicalParticipants: any[];
  onlineParticipants: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Creator {
  userId: string;
  name: string;
  picture: string;
}
