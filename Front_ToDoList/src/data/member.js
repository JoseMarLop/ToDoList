const API_URL = "http://localhost:8080/api";
const token = localStorage.getItem("token");

export const addMember = async (tableId,userEmail) => {
  try {
    const response = await fetch(`${API_URL}/addMember/${tableId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userEmail),
    });
    const data = await response.json();

    return { data };
  } catch (error) {
    return { error: error.message || "Something went wrong" };
  }
};