const BASE_URL = "http://localhost:4000/api/v1";
export async function getChatReply({ history, message }) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ history, message }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to get reply from AI");
  }

  const data = await res.json();
  return data.reply; 
}
