import axios from "axios";
import nookies from "nookies";

export async function fetchClubList() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/all`);
    return response.data;
  } catch (error) {
    console.log("Error fetching club list:", error);
    throw error;
  }
}
export async function fetchMyClubs(userId: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/clubs`, {
      headers: { Authorization: `Bearer ${nookies.get().access_token}` },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching myclub list:", error);
    throw error;
  }
}

export async function fetchDocs(clubId: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/docs`, {
      headers: { Authorization: `Bearer ${nookies.get().access_token}` },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching docs:", error);
    throw error;
  }
}
