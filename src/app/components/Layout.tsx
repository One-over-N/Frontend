import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { AppBar, Toolbar, Button, IconButton, Badge, Box, Container, Typography } from "@mui/material";
import { Notifications as NotificationsIcon, Logout as LogoutIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { NotificationPanel } from "./NotificationPanel";
import { Logo } from "./Logo";
import { getToken, removeToken, authHeaders } from "../utils/auth";

export function Layout() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const menuItems = [
    { text: "홈", path: "/" },
    { text: "내 파티", path: "/parties" },
    { text: "정산", path: "/payments" },
    { text: "마이", path: "/mypage" },
  ];

  useEffect(() => {
    if (!getToken() || isAuthPage) return;
    fetch(`${API_URL}/api/notifications/unread-count", { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setUnreadCount(d.result ?? 0))
      .catch(() => {});
  }, [location.pathname]);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  if (isAuthPage) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Outlet />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #F3F4F6" }}>
        <Toolbar sx={{ py: 2, gap: 2 }}>
          <Box component={Link} to="/" sx={{ textDecoration: "none", mr: { xs: "auto", md: 4 } }}>
            <Logo />
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1, gap: 1 }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: isActive ? "primary.main" : "text.secondary",
                    fontWeight: 500,
                    fontSize: "1rem",
                    px: 3, py: 1,
                    borderRadius: 3,
                    bgcolor: isActive ? "#EDE9FE" : "transparent",
                    "&:hover": { bgcolor: isActive ? "#EDE9FE" : "rgba(109, 40, 217, 0.04)", color: "primary.main" },
                  }}
                >
                  {item.text}
                </Button>
              );
            })}
          </Box>

          <IconButton
            color="primary"
            onClick={() => setNotificationOpen(true)}
            sx={{ width: 44, height: 44, "&:hover": { bgcolor: "rgba(109, 40, 217, 0.04)" } }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            color="primary"
            onClick={handleLogout}
            sx={{ width: 44, height: 44, display: { xs: "none", md: "inline-flex" }, "&:hover": { bgcolor: "rgba(109, 40, 217, 0.04)" } }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <NotificationPanel open={notificationOpen} onClose={() => setNotificationOpen(false)} />

      <Container component="main" maxWidth="lg" sx={{ flex: 1, py: 4, mb: { xs: "80px", md: 0 } }}>
        <Outlet />
      </Container>

      <Box
        component="nav"
        sx={{ display: { xs: "block", md: "none" }, position: "fixed", bottom: 0, left: 0, right: 0, bgcolor: "white", borderTop: "1px solid #F3F4F6", boxShadow: "0 -2px 10px rgba(0,0,0,0.05)", zIndex: 1000 }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", py: 1.5 }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  sx={{
                    display: "flex", flexDirection: "column", alignItems: "center", minWidth: "64px",
                    color: isActive ? "primary.main" : "text.secondary",
                    "&:hover": { bgcolor: "transparent", color: "primary.main" },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: isActive ? 700 : 500 }}>{item.text}</Typography>
                </Button>
              );
            })}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}