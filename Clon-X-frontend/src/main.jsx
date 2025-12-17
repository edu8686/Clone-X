import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useContext } from "react";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import SignUp from "./pages/sign-up.jsx";
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx";
import { UserContext } from "./context/UserContext.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import Explore from "./pages/Explore.jsx";
import NormalLayout from "./pages/layouts/NormalLayout.jsx";
import ChatLayout from "./pages/layouts/ChatsLayout.jsx";
import Profile from "./pages/Profile.jsx"

export const Protected = ({ children }) => {
  const { loginUser, loading } = useContext(UserContext);

  if (loading) return <div>Cargando...</div>;
  if (!loginUser) return <Navigate to="/auth/login" replace />;

  return children;
};

export const Public = ({ children }) => {
  const { loginUser } = useContext(UserContext);
  return loginUser ? <Navigate to="/" replace /> : children;
};

const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: (
      <Public>
        <Login />
      </Public>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <Public>
        <SignUp />
      </Public>
    ),
  },
  {
    path: "/",
    element: (
      <Protected>
        <App />
      </Protected>
    ),
    children: [
      {
        element: <NormalLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "explore", element: <Explore /> },
          { path: "profile/:userId", element: <Profile /> },
        ],
      },
      {
        path: "chat",
        element: <ChatLayout />,
      },
    ],
  },
]);


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>
);
