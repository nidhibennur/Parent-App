import {
  Plus,
  MessageSquare,
  Trash2,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

export default function ChatSidebar({
  chats,
  activeId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  collapsed,
  onToggleCollapse,
}) {
  const sorted = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);

  if (collapsed) {
    return (
      <aside className="gpt-sidebar gpt-sidebar-collapsed">
        <button
          type="button"
          className="gpt-sidebar-icon-btn"
          onClick={onToggleCollapse}
          title="Open sidebar"
        >
          <PanelLeft size={20} />
        </button>
        <button
          type="button"
          className="gpt-sidebar-icon-btn"
          onClick={onNewChat}
          title="New chat"
        >
          <Plus size={20} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="gpt-sidebar">
      <div className="gpt-sidebar-top">
        <span className="gpt-sidebar-heading">Chats</span>
        <button
          type="button"
          className="gpt-sidebar-icon-btn"
          onClick={onToggleCollapse}
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      <button type="button" className="gpt-new-chat-btn" onClick={onNewChat}>
        <Plus size={18} />
        New chat
      </button>

      <div className="gpt-sidebar-section-label">Previous chats</div>
      <nav className="gpt-chat-list" aria-label="Previous chats">
        {sorted.length === 0 ? (
          <p className="gpt-chat-list-empty">No previous chats yet</p>
        ) : (
          sorted.map((chat) => (
            <div
              key={chat.id}
              className={`gpt-chat-item ${chat.id === activeId ? "active" : ""}`}
            >
              <button
                type="button"
                className="gpt-chat-item-btn"
                onClick={() => onSelectChat(chat.id)}
              >
                <MessageSquare size={16} />
                <span>{chat.title}</span>
              </button>
              <button
                type="button"
                className="gpt-chat-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                aria-label="Delete chat"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </nav>
    </aside>
  );
}
