const BASE_KEY = "parentapp_chats";

function storageKey(userKey) {
  return userKey ? `${BASE_KEY}_${userKey}` : BASE_KEY;
}

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

export function loadChatStore(userKey) {
  try {
    const raw = localStorage.getItem(storageKey(userKey));
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

export function saveChatStore(chats, activeId, userKey) {
  localStorage.setItem(
    storageKey(userKey),
    JSON.stringify({ chats, activeId, savedAt: Date.now() })
  );
}

export function deriveTitle(messages) {
  const firstUser = messages.find((m) => m.user && !m.audio && m.text?.trim());
  if (!firstUser) return "New chat";
  const t = firstUser.text.trim();
  return t.length > 36 ? `${t.slice(0, 36)}…` : t;
}
