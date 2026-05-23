import { createBrowserRouter, Navigate, useSearchParams } from "react-router";
import rootlayout from "../layouts/rootlayout";
import ChatCard from "../pages/Chat card/Chat_Card/ChatCard";
import CalmTool from "../pages/CalmTool/CalmTool";
import Learning from "../pages/Learning/Learning";
import TopicDetail from "../pages/Learning/TopicDetail";
import Emergency from "../pages/Emergency/Emergency";
import Profile from "../pages/Profile/Profile";
import Welcome from "../pages/Welcome/Welcome";
import DailyTips from "../pages/DailyTips/DailyTips";
import MoodCheckin from "../pages/MoodCheckin/MoodCheckin";
import Milestones from "../pages/Milestones/Milestones";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

function ChatRedirect() {
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();
  return <Navigate to={search ? `/?${search}` : "/"} replace />;
}

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  {
    path: "/",
    Component: rootlayout,
    children: [
      { index: true, Component: ChatCard },
      { path: "home", element: <Navigate to="/" replace /> },
      { path: "chat", Component: ChatRedirect },
      { path: "calm-tools", Component: CalmTool },
      { path: "learn", Component: Learning },
      { path: "learn/:topicId", Component: TopicDetail },
      { path: "emergency", Component: Emergency },
      { path: "profile", Component: Profile },
      { path: "welcome", Component: Welcome },
      { path: "tips", Component: DailyTips },
      { path: "mood", Component: MoodCheckin },
      { path: "milestones", Component: Milestones },
    ],
  },
]);
