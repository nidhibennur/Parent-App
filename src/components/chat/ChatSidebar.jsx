import {
  Plus,
  MessageSquare,
  Trash2,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

function dateGroup(ts) {
  const now = new Date();
  const d = new Date(ts);
  const diffDays = Math.floor((now - d) / 86400000);
  const nowDay = now.toDateString();
  const dDay = d.toDateString();
  if (dDay === nowDay) return "Today";
  if (diffDays < 2) return "Yesterday";
  if (diffDays < 7) return "Previous 7 days";
  if (diffDays < 30) return "Previous 30 days";
  return d.toLocaleDateString("en", { month: "long", year: "numeric" });
}

function groupChats(chats) {
  const sorted = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
  const groups = [];
  const seen = new Map();
  for (const chat of sorted) {
    if (!chat.messages?.some((m) => m.user)) continue; // skip empty chats from sidebar
    const label = dateGroup(chat.updatedAt);
    if (!seen.has(label)) { seen.set(label, []); groups.push({ label, chats: seen.get(label) }); }
    seen.get(label).push(chat);
  }
  return groups;
}

function ChatItem({ chat, activeId, onSelectChat, onDeleteChat }) {
  return (
    <div className={`gpt-chat-item ${chat.id === activeId ? "active" : ""}`}>
      <button
        type="button"
        className="gpt-chat-item-btn"
        onClick={() => onSelectChat(chat.id)}
      >
        <MessageSquare size={15} />
        <span>{chat.title}</span>
      </button>
      <button
        type="button"
        className="gpt-chat-delete"
        onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
        aria-label="Delete chat"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

export default function ChatSidebar({
  chats,
  activeId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  collapsed,
  onToggleCollapse,
}) {
  const groups = groupChats(chats);

  if (collapsed) {
    return (
      <aside className="gpt-sidebar gpt-sidebar-collapsed">
        <button type="button" className="gpt-sidebar-icon-btn" onClick={onToggleCollapse} title="Open sidebar">
          <PanelLeft size={20} />
        </button>
        <button type="button" className="gpt-sidebar-icon-btn" onClick={onNewChat} title="New chat">
          <Plus size={20} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="gpt-sidebar">
      <div className="gpt-sidebar-top">
        <span className="gpt-sidebar-heading">Chats</span>
        <button type="button" className="gpt-sidebar-icon-btn" onClick={onToggleCollapse} aria-label="Collapse sidebar">
          <PanelLeftClose size={18} />
        </button>
      </div>

      <button type="button" className="gpt-new-chat-btn" onClick={onNewChat}>
        <Plus size={18} />
        New chat
      </button>

      <nav className="gpt-chat-list" aria-label="Previous chats">
        {groups.length === 0 ? (
          <p className="gpt-chat-list-empty">No previous chats yet</p>
        ) : (
          groups.map(({ label, chats: groupedChats }) => (
            <div key={label} className="gpt-chat-group">
              <div className="gpt-chat-group-label">{label}</div>
              {groupedChats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  activeId={activeId}
                  onSelectChat={onSelectChat}
                  onDeleteChat={onDeleteChat}
                />
              ))}
            </div>
          ))
        )}
      </nav>
    </aside>
  );
}
