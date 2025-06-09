const API_URL = import.meta.env.VITE_API_URL || "http://localhost/api";
const token = localStorage.getItem("token");
const locale = localStorage.getItem("language") || "en";

export const addMember = async (tableId, userEmail) => {
  try {
    const response = await fetch(`${API_URL}/addMember/${tableId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Locale": locale,
      },
      body: JSON.stringify(userEmail),
    });
    const data = await response.json();

    return { data };
  } catch (error) {
    return { error: error.message || "Something went wrong" };
  }
};

export const updateMember = async (tableId, userId) => {
  try {
    const response = await fetch(`${API_URL}/updateMember/${tableId}/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Locale": locale,
      },
    });
    const data = await response.json();

    return { data };
  } catch (error) {
    return { error: error.message || "Something went wrong" };
  }
};

export const deleteMember = async (memberId) => {
  try {
    const response = await fetch(`${API_URL}/deleteMember/${memberId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    return { data };
  } catch (error) {
    return { error: error.message || "Something went wrong" };
  }
};
