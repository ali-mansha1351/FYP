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

export async function getAllPosts() {
  const res = await fetch(`${API_BASE_URL}/post/all`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json();
    console.log(err);
    throw new Error(err.error);
  }

  const result = await res.json();
  return result;
}

export async function deletePost(id) {
  const res = await fetch(`${API_BASE_URL}/post/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    console.log(err.error);
    throw new Error(err.error);
  }

  const result = await res.json();
  return result;
}

export async function getSavedPosts() {
  const res = await fetch(`${API_BASE_URL}/post/saved`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json();
    console.log(err.error);
    throw new Error(err.error);
  }

  const result = await res.json();
  return result;
}

export async function savePost(id) {
  const res = await fetch(`${API_BASE_URL}/post/save/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      // Add any other required headers
    },
  });
  if (!res.ok) {
    const err = await res.json();
    console.log(err.error);
    throw new Error(err.error);
  }

  const result = await res.json();
  return result;
}
