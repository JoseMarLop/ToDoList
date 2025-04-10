const API_URL = "http://localhost:8080/api";
const token = localStorage.getItem("token");

export const getComments = async (taskId) => {
  try {
    const response = await fetch(`${API_URL}/comments/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message || "Something went wrong" };
  }
};

export const addComment = async (taskId, content) => {
  try {
    const response = await fetch(`${API_URL}/newComments/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
      method: "POST",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message || "Something went wrong" };
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await fetch(`${API_URL}/deleteComment/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message || "Something went wrong" };
  }
};
