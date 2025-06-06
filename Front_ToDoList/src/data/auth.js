const API_URL = "http://localhost:8080/api";
const token = localStorage.getItem("token");
const locale = localStorage.getItem("language") || "en";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Language": locale,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (!response.ok) {
      return { error: data.error || "Login failed" };
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
    }

    return { data };
  } catch (error) {
    return { error: error.message || "Something went wrong" };
  }
};

export const register = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Language": locale,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Register response:", data);

    return { data };
  } catch (error) {
    return { error: error.message || "Something went wrong" };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  window.location.reload();
};

export const updatePassword = async (passwordData) => {
  try {
    const response = await fetch(`${API_URL}/changePassword`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Language": locale,
      },
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();

    return { data };
  } catch (error) {
    return { error: error.message || "Something went wrong" };
  }
};

export const updateEmail = async (emailData) => {
  try {
    const response = await fetch(`${API_URL}/changeEmail`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Language": locale,
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Unknown error" };
    }

    return { data };
  } catch (error) {
    return { error: error.message || "Something went wrong" };
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};
