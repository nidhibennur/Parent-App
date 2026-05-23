const API = "http://localhost:4000";
const getToken = () => localStorage.getItem("parentapp-token");

export async function fetchChats() {
  const token = getToken();
  if (!token) return [];
  try {
    const res = await fetch(`${API}/api/chats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}

export function saveChat(chat) {
  const token = getToken();
  if (!token) return;
  fetch(`${API}/api/chats`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(chat),
  }).catch(() => {});
}

export function removeChat(chatId) {
  const token = getToken();
  if (!token) return;
  fetch(`${API}/api/chats/${chatId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {});
}
