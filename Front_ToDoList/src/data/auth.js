const API_URL = 'http://localhost:8080/api';

export const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        return { error: data.error || 'Login failed' };
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        // localStorage.setItem("roles", JSON.stringify(data.roles));
        localStorage.setItem('email',data.email)  // Asegúrate de convertir los roles a string
      }

      return { data }; // Devuelve los datos si la respuesta es exitosa
    } catch (error) {
      return { error: error.message || 'Something went wrong' };
    }
};

export const register = async (email,password)=>{
  try{
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Register response:', data);


    return { data };
  } catch (error){
    return { error: error.message || 'Something went wrong' };
  }
}

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.reload();
}

export const getToken = () => {
    return localStorage.getItem("token");
}

export const isAuthenticated = () => {
    const token = getToken();
    return !!token;
}