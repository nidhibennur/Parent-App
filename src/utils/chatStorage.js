const STORAGE_KEY = "parentapp_chats";

export function createEmptyChat(topic = null) {
  return {
    id: crypto.randomUUID(),
    title: "New chat",
    topic,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function loadChatStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { chats: [], activeId: null };
    const parsed = JSON.parse(raw);
    return {
      chats: Array.isArray(parsed.chats) ? parsed.chats : [],
      activeId: parsed.activeId ?? null,
    };
  } catch {
    return { chats: [], activeId: null };
  }
}

export function saveChatStore(chats, activeId) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ chats, activeId, savedAt: Date.now() })
  );
}

export function deriveTitle(messages) {
  const firstUser = messages.find((m) => m.user && !m.audio && m.text?.trim());
  if (!firstUser) return "New chat";
  const t = firstUser.text.trim();
  return t.length > 36 ? `${t.slice(0, 36)}…` : t;
}

