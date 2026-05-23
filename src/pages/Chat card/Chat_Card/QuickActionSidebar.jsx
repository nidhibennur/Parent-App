import { useNavigate } from "react-router-dom";
import { QUICK_ACTIONS } from "../../../data/quickActions";

const QuickActionSidebar = ({ onQuickAction }) => {
  const navigate = useNavigate();

  const trigger = (action) => {
    if (onQuickAction) {
      onQuickAction(action);
      return;
    }
    const params = new URLSearchParams({
      prompt: action.prompt,
      topic: action.id,
    });
    navigate(`/?${params.toString()}`);
  };

  return (
    <div className="gpt-right-panel-inner">
      <h2 className="quick-panel-title">Quick help</h2>
      <p className="quick-panel-sub">Instant AI support</p>
      <div className="gpt-quick-actions">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            className="quick-action-btn"
            onClick={() => trigger(action)}
          >
            <span>{action.emoji}</span>
            {action.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="sos-button compact"
        onClick={() => navigate("/emergency")}
      >
        SOS — need help now
      </button>
    </div>
  );
};

export default QuickActionSidebar;
