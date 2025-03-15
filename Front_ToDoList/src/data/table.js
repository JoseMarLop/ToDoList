const API_URL = "http://localhost:8080/api";
const token = localStorage.getItem("token");

export const getTables = async () => {
  try {
    const response = await fetch(`${API_URL}/tables`, {
      method: "GET",
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

export const addTable = async (tableData) => {
  try {
    const response = await fetch(`${API_URL}/newTable`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tableData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message || "Something went wrong" };
  }
};

export const updateTable = async (tableData,id) => {
  try {
    const response = await fetch(`${API_URL}/updateTable/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tableData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message || "Something went wrong" };
  }
};

export const deleteTable = async (id) => {
    try{
        const response = await fetch(`${API_URL}/deleteTable/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    }catch (error) {
        return { error: error.message || "Something went wrong" };
    }
}