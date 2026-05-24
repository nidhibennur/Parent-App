import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../pages/shared/header/Header";
import { useAuth } from "../context/AuthContext";
import OnboardingModal from "../components/onboarding/OnboardingModal";

const rootlayout = () => {
  const { pathname } = useLocation();
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const isChat = pathname === "/";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-icon">
          <img src="/logo.png" alt="ParentApp" />
        </div>
        <p className="app-loading-label">Parent App</p>
        <p className="app-loading-sub">Getting everything ready…</p>
        <div className="app-loading-bar-wrap">
          <div className="app-loading-bar" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className={isChat ? "layout-chat-active" : ""}>
      {user && !user.onboarded && <OnboardingModal />}
      <Header />
      <div key={pathname} className={isChat ? "chat-page-below-nav" : "app-page"}>
        <Outlet />
      </div>
    </div>
  );
};

export default rootlayout;
