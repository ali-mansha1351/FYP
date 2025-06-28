const API_BASE_URL = "http://localhost:4000/api/v1/user";
export const toggleFollowApi = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/toggle-follow/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to toggle follow status");
  }

  return data;
};
