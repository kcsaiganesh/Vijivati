import axios from "axios";

export async function get(url: string) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("GET request failed", error);
    throw error;
  }
}

export async function post(url: string, data: any) {
  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("POST request failed", error);
    throw error;
  }
}
