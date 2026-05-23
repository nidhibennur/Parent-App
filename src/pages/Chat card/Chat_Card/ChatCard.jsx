import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Mic, SendHorizontal, Square, Bot } from "lucide-react";
import { CHAT_SUGGESTIONS } from "../../../data/quickActions";
import ChatSidebar from "../../../components/chat/ChatSidebar";
import QuickActionSidebar from "./QuickActionSidebar";
import { useAuth } from "../../../context/AuthContext";
import { fetchChats, saveChat, removeChat } from "../../../utils/chatApi";
import {
  createEmptyChat,
  loadChatStore,
  saveChatStore,
  deriveTitle,
} from "../../../utils/chatStorage";

const ChatCard = () => {
  const { profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPrompt = searchParams.get("prompt");
  const topic = searchParams.get("topic");

  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [typing, setTyping] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const seededRef = useRef(false);
  const pendingSendRef = useRef(null);
  const messagesEndRef = useRef(null);

  const activeChat = chats.find((c) => c.id === activeId);
  const messages = activeChat?.messages ?? [];

  const persist = useCallback((nextChats, nextActiveId) => {
    setChats(nextChats);
    setActiveId(nextActiveId);
    saveChatStore(nextChats, nextActiveId);
  }, []);

  const updateActiveMessages = useCallback(
    (updater) => {
      if (!activeId) return;
      setChats((prev) => {
        const next = prev.map((c) => {
          if (c.id !== activeId) return c;
          const msgs = typeof updater === "function" ? updater(c.messages) : updater;
          return { ...c, messages: msgs, title: deriveTitle(msgs), updatedAt: Date.now() };
        });
        saveChatStore(next, activeId);
        return next;
      });
    },
    [activeId]
  );

  // Load chats from MongoDB on mount, fall back to localStorage
  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;

    (async () => {
      let mongoChats = [];
      try { mongoChats = await fetchChats(); } catch { /* offline, use localStorage */ }

      const localStore = loadChatStore();
      const baseChats = mongoChats.length > 0 ? mongoChats : localStore.chats;

      if (initialPrompt) {
        const chat = createEmptyChat(topic);
        const next = [chat, ...baseChats.filter((c) => c.id !== chat.id)];
        persist(next, chat.id);
        setSearchParams({});
        saveChat(chat);
        pendingSendRef.current = initialPrompt;
        return;
      }

      // Always start with a fresh new chat as active; previous chats go to sidebar
      const chatsWithMessages = baseChats.filter((c) => c.messages.some((m) => m.user));
      const newChat = createEmptyChat();
      persist([newChat, ...chatsWithMessages], newChat.id);
      // Don't save the empty chat to MongoDB — sendText will save it on first message
    })();
  }, []);

  // Fire pending send (from quick actions or initialPrompt) after activeId is set
  useEffect(() => {
    if (!pendingSendRef.current || !activeId) return;
    const msg = pendingSendRef.current;
    pendingSendRef.current = null;
    sendText(msg);
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (text, isUser = true, isAudio = false) => {
    updateActiveMessages((prev) => [...prev, { text, user: isUser, audio: isAudio }]);
  };

  const sendText = async (text) => {
    if (!text?.trim() || !activeId) return;

    const userMsg = { text: text.trim(), user: true, audio: false };
    const prevMessages = activeChat?.messages ?? [];

    addMessage(text.trim(), true);
    setInput("");
    setTyping(true);

    const history = prevMessages
      .filter((m) => !m.audio)
      .map((m) => ({ role: m.user ? "user" : "assistant", content: m.text }));

    try {
      const res = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...history, { role: "user", content: text.trim() }],
          profile,
        }),
      });

      setTyping(false);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;
          try {
            const token = JSON.parse(raw).choices?.[0]?.delta?.content ?? "";
            if (token) { accumulated += token; setStreamingText(accumulated); }
          } catch { /* incomplete chunk */ }
        }
      }

      if (accumulated) {
        addMessage(accumulated, false);
        setStreamingText("");

        // Sync full updated chat to MongoDB
        const aiMsg = { text: accumulated, user: false, audio: false };
        const updatedMessages = [...prevMessages, userMsg, aiMsg];
        const title = deriveTitle(updatedMessages);
        saveChat({
          id: activeId,
          title,
          topic: activeChat?.topic ?? null,
          messages: updatedMessages,
          updatedAt: Date.now(),
          createdAt: activeChat?.createdAt ?? Date.now(),
        });
      }
    } catch {
      setTyping(false);
      setStreamingText("");
      addMessage("Couldn't reach the server. Make sure the backend is running.", false);
    }
  };

  const sendMessage = () => sendText(input);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleRecord = async () => {
    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        addMessage(URL.createObjectURL(blob), true, true);
        setTimeout(() => addMessage("I heard your voice message. Voice-to-AI coming soon.", false), 500);
      };
      mediaRecorder.start();
      setRecording(true);
    } else {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const startNewChat = useCallback(
    (topicId = null, prompt = null) => {
      const chat = createEmptyChat(topicId);
      // Drop any existing empty chats (no user messages) before adding the new one
      const withoutEmpties = chats.filter((c) => c.messages.some((m) => m.user));
      const next = [chat, ...withoutEmpties];
      persist(next, chat.id);
      setSearchParams({});
      seededRef.current = true;
      saveChat(chat);
      if (prompt) pendingSendRef.current = prompt;
      return chat.id;
    },
    [chats, persist, setSearchParams]
  );

  const selectChat = (id) => {
    persist(chats, id);
    seededRef.current = true;
    setSearchParams({});
  };

  const deleteChat = (id) => {
    removeChat(id);
    const next = chats.filter((c) => c.id !== id);
    if (next.length === 0) {
      const chat = createEmptyChat();
      persist([chat], chat.id);
      saveChat(chat);
      return;
    }
    const nextActive = id === activeId ? next[0].id : activeId;
    persist(next, nextActive);
  };

  const handleQuickAction = (action) => {
    startNewChat(action.id, action.prompt);
  };

  const userInitial = profile?.name?.[0]?.toUpperCase() ?? "Y";
  const showEmptyState = !messages.some((m) => m.user);

  return (
    <div className={`gpt-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <ChatSidebar
        chats={chats}
        activeId={activeId}
        onNewChat={() => startNewChat()}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />

      <div className="gpt-main">
        <header className="gpt-topbar">
          <button
            type="button"
            className="gpt-topbar-menu"
            onClick={() => setSidebarCollapsed((c) => !c)}
            aria-label="Toggle sidebar"
          >
            <span /><span /><span />
          </button>
          <div className="gpt-topbar-title">
            <div className="gpt-topbar-avatar"><Bot size={20} /></div>
            <div className="gpt-topbar-info">
              <span className="gpt-topbar-name">{activeChat?.title ?? "Parent App AI"}</span>
              <span className="gpt-topbar-status">
                <span className="gpt-status-dot" />
                {typing ? "typing…" : "ready to help"}
              </span>
            </div>
          </div>
          {topic && (
            <span className="gpt-topbar-topic">{topic.replace(/-/g, " ")}</span>
          )}
        </header>

        <div className="gpt-messages">
          {showEmptyState ? (
            <div className="gpt-empty">
              <div className="gpt-empty-icon"><img src="/logo.png" alt="" className="empty-logo-img" /></div>
              <h1>
                {profile?.name ? `Hi ${profile.name}! How can I help?` : "How can I support you today?"}
              </h1>
              <p>Describe what&apos;s happening — or pick a suggestion below.</p>
              <div className="gpt-empty-chips">
                {CHAT_SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => sendText(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="gpt-thread">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`gpt-row ${msg.user ? "gpt-row-user" : "gpt-row-assistant"}`}
                >
                  <div className="gpt-avatar">{msg.user ? userInitial : <Bot size={16} />}</div>
                  <div className="gpt-bubble">
                    {msg.audio ? (
                      <audio controls className="gpt-audio">
                        <source src={msg.text} type="audio/webm" />
                      </audio>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="gpt-row gpt-row-assistant">
                  <div className="gpt-avatar"><Bot size={16} /></div>
                  <div className="gpt-bubble gpt-bubble-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              {streamingText && (
                <div className="gpt-row gpt-row-assistant">
                  <div className="gpt-avatar"><Bot size={16} /></div>
                  <div className="gpt-bubble"><p>{streamingText}</p></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="gpt-composer-wrap">
          <div className="gpt-composer">
            <textarea
              rows={1}
              placeholder="Message Parent App…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="gpt-composer-actions">
              <button
                type="button"
                className={`gpt-composer-btn ${recording ? "recording" : ""}`}
                onClick={handleRecord}
                aria-label="Voice input"
              >
                {recording ? <Square size={18} /> : <Mic size={18} />}
              </button>
              <button
                type="button"
                className="gpt-composer-btn send"
                onClick={sendMessage}
                disabled={!input.trim()}
                aria-label="Send"
              >
                <SendHorizontal size={18} />
              </button>
            </div>
          </div>
          <p className="gpt-composer-hint">
            Parent App can make mistakes. Seek professional help in emergencies.
          </p>
        </div>
      </div>

      <aside className="gpt-right-panel">
        <QuickActionSidebar onQuickAction={handleQuickAction} />
      </aside>
    </div>
  );
};

export default ChatCard;
