import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { OTTDetail } from "./pages/OTTDetail";
import { MyPage } from "./pages/MyPage";
import { PaymentManagement } from "./pages/PaymentManagement";
import { PartyManagement } from "./pages/PartyManagement";
import { NotFound } from "./pages/NotFound";
import { getToken } from "./utils/auth";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return getToken() ? <>{children}</> : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, element: getToken() ? <Navigate to="/home" replace /> : <Navigate to="/login" replace /> },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "services/:serviceId", element: <PrivateRoute><OTTDetail /></PrivateRoute> },
      { path: "home", element: <PrivateRoute><Home /></PrivateRoute> },
      { path: "mypage", element: <PrivateRoute><MyPage /></PrivateRoute> },
      { path: "payments", element: <PrivateRoute><PaymentManagement /></PrivateRoute> },
      { path: "parties", element: <PrivateRoute><PartyManagement /></PrivateRoute> },
      { path: "*", Component: NotFound },
    ],
  },
]);