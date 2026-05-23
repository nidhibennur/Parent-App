const API = "http://localhost:4000";
const getToken = () => localStorage.getItem("parentapp-token");

export async function fetchMilestones() {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API}/api/milestones`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? res.json() : null; // { checked: {...} }
  } catch {
    return null;
  }
}

export function saveMilestones(checked) {
  const token = getToken();
  if (!token) return;
  fetch(`${API}/api/milestones`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ checked }),
  }).catch(() => {});
}
