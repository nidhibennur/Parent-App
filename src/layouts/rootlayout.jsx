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
        <div className="app-loading-icon"><img src="/logo.png" alt="" className="auth-mobile-logo-img" /></div>
        <p>Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className={isChat ? "layout-chat-active" : ""}>
      {user && !user.onboarded && <OnboardingModal />}
      <Header />
      <div className={isChat ? "chat-page-below-nav" : "app-page"}>
        <Outlet />
      </div>
    </div>
  );
};

export default rootlayout;
