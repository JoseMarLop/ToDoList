const API_URL = "http://localhost:8080/api";
const token = localStorage.getItem("token");

export const addTask = async (taskData) => {
    try {
        const response = await fetch(`${API_URL}/newTask`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
        });
    
        const data = await response.json();
        return data;
    } catch (error) {
        return { error: error.message || "Something went wrong" };
    }
}