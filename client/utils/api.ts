import axios from "axios";

export async function fetchClubList() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/all`);
    return response.data;
  } catch (error) {
    console.log("Error fetching club list:", error);
    throw error;
  }
}
