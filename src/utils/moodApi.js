const API = "http://localhost:4000";
const getToken = () => localStorage.getItem("parentapp-token");

export async function fetchMoodLog() {
  const token = getToken();
  if (!token) return [];
  try {
    const res = await fetch(`${API}/api/mood-log`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}

export function saveMoodEntry(moodId, date) {
  const token = getToken();
  if (!token) return;
  fetch(`${API}/api/mood-log`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ moodId, date }),
  }).catch(() => {});
}
