const API_URL = 'http://localhost:8080/api';
const token = localStorage.getItem("token");

export const getTables = async () => {
    try{
        const response = await fetch(`${API_URL}/tables`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();

       return {data};
    }catch(error){
        return {error: error.message || 'Something went wrong'};
    }
}