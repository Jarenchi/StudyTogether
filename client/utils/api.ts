import axios from "axios";
import nookies from "nookies";

export async function fetchMyClubs(userId: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/clubs`, {
      headers: { Authorization: `Bearer ${nookies.get().access_token}` },
    });
    return response.data;
  } catch (error) {
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
    throw error;
  }
}
