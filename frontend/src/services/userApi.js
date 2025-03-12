const API_BASE_URL = "http://192.168.18.36:4000/api/v1";

export async function login({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/user/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errData = await response.json();
    console.log(errData);
    console.log("error message", errData.error);
    throw new Error(errData.error);
  }

  const data = await response.json();
  return data;
}

export async function getLoggedInUser() {
  const response = await fetch(`${API_BASE_URL}/user/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errData = await response.json();
    console.log(errData);
    throw new Error(errData.message || "failed to get currenly logged in user");
  }
  const data = await response.json();
  return data.user;
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/user/logout`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errData = await response.json();
    console.log(errData);
    throw new Error(errData.message || "failed to logout user");
  }
  const data = await response.json();
  return data;
}
