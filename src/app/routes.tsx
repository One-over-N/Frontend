import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { OTTDetail } from "./pages/OTTDetail";
import { MyPage } from "./pages/MyPage";
import { PaymentManagement } from "./pages/PaymentManagement";
import { PartyManagement } from "./pages/PartyManagement";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "services/:serviceId", Component: OTTDetail },
      { path: "mypage", Component: MyPage },
      { path: "payments", Component: PaymentManagement },
      { path: "parties", Component: PartyManagement },
      { path: "*", Component: NotFound },
    ],
  },
]);
