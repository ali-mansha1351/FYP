const BASE_URL = "http://localhost:4000/api/v1";

export async function createPattern(patternData) {
  console.log(patternData)
  const res = await fetch(`${BASE_URL}/patterns`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patternData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create pattern");
  }

  return res.json();
}