const API_BASE_URL = "http://localhost:4000/api/v1/user";

export async function createPost(data) {
  const res = await fetch(`${API_BASE_URL}/post`, {
    method: "POST",
    credentials: "include",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json();
    console.log(err);
    console.log(err.error);
    throw new Error(err.error);
  }

  const result = await res.json();
  return result;
}
