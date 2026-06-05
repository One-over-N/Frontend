import { useState, useEffect } from "react";
import { Drawer, Typography, Box, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Close as CloseIcon, Payment as PaymentIcon, PersonAdd as PersonAddIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { authHeaders, getToken, API_URL } from "../utils/auth";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

const getNotificationMeta = (type: string) => {
  switch (type) {
    case "PAYMENT_REQUEST": return { title: "결제 요청", color: "#6D28D9" };
    case "JOIN_REQUEST":    return { title: "파티 가입 신청", color: "#DB2777" };
    case "JOIN_APPROVED":   return { title: "파티 가입 수락", color: "#10B981" };
    case "JOIN_REJECTED":   return { title: "파티 가입 거절", color: "#EF4444" };
    default:                return { title: "알림", color: "#6D28D9" };
  }
};

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [joinDialog, setJoinDialog] = useState<{ requestId: string } | null>(null);

  useEffect(() => {
    if (!open || !getToken()) return;
    fetch(`${API_URL}/api/notifications`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => {
        const raw = d.result;
        if (Array.isArray(raw)) setNotifications(raw);
        else if (raw?.dataList && Array.isArray(raw.dataList)) setNotifications(raw.dataList);
        else if (raw?.content && Array.isArray(raw.content)) setNotifications(raw.content);
        else setNotifications([]);
      })
      .catch(() => {});
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleClickNotification = async (notification: any) => {
    if (!notification.isRead) {
      await fetch(`${API_URL}/api/notifications`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify([notification.notificationId]),
      });
      setNotifications(prev => prev.map(n => n.notificationId === notification.notificationId ? { ...n, isRead: true } : n));
    }

    if (notification.notificationType === "JOIN_REQUEST" && notification.targetUrl) {
      const match = notification.targetUrl.match(/\/join-requests\/(\d+)/);
      if (match) {
        setJoinDialog({ requestId: match[1] });
        return;
      }
    }

    onClose();
    if (notification.targetUrl) {
      const url = notification.targetUrl
        .replace("/api/ott-service", "")
        .replace("/api/notifications", "/parties")
        .replace("/api", "");
      navigate(url);
    }
  };

  const handleApprove = async () => {
    if (!joinDialog) return;
    await fetch(`${API_URL}/api/ott-service/parties/join-requests/${joinDialog.requestId}?status=APPROVED`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    alert("승인 완료!");
    setJoinDialog(null);
    onClose();
  };

  const handleReject = async () => {
    if (!joinDialog) return;
    await fetch(`${API_URL}/api/ott-service/parties/join-requests/${joinDialog.requestId}?status=REJECTED`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    alert("거절 완료!");
    setJoinDialog(null);
    onClose();
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.notificationId);
    if (unreadIds.length === 0) return;
    await fetch(`${API_URL}/api/notifications`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(unreadIds),
    });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 380, height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 3, borderBottom: "1px solid #F3F4F6" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>알림</Typography>
              {unreadCount > 0 && (
                <Box sx={{ px: 1, py: 0.25, bgcolor: "#6D28D9", borderRadius: 10, minWidth: 22, textAlign: "center" }}>
                  <Typography variant="caption" sx={{ color: "white", fontWeight: 700, fontSize: "0.7rem" }}>{unreadCount}</Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {unreadCount > 0 && (
                <Button size="small" onClick={handleMarkAllRead} sx={{ color: "text.secondary", fontSize: "0.75rem", minWidth: "auto" }}>
                  모두 읽음
                </Button>
              )}
              <IconButton onClick={onClose} sx={{ color: "text.secondary" }}><CloseIcon /></IconButton>
            </Box>
          </Box>

          <Box sx={{ p: 2, flex: 1, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                <Typography variant="body2">알림이 없습니다</Typography>
              </Box>
            ) : notifications.map((notification) => {
              const meta = getNotificationMeta(notification.notificationType);
              return (
                <Box
                  key={notification.notificationId}
                  onClick={() => handleClickNotification(notification)}
                  sx={{
                    p: 2.5, mb: 1.5,
                    bgcolor: notification.isRead ? "background.default" : `${meta.color}08`,
                    borderRadius: 3,
                    borderLeft: `4px solid ${notification.isRead ? "#E5E7EB" : meta.color}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    position: "relative",
                    "&:hover": { bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
                  }}
                >
                  {!notification.isRead && (
                    <Box sx={{ position: "absolute", top: 12, right: 12, width: 8, height: 8, borderRadius: "50%", bgcolor: meta.color }} />
                  )}
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: notification.isRead ? "#F3F4F6" : `${meta.color}15`, color: notification.isRead ? "#9CA3AF" : meta.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {notification.notificationType === "PAYMENT_REQUEST" ? <PaymentIcon /> :
                       notification.notificationType === "JOIN_REQUEST" ? <PersonAddIcon /> : <CheckCircleIcon />}
                    </Box>
                    <Box sx={{ flex: 1, pr: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: notification.isRead ? 600 : 700, mb: 0.5, color: notification.isRead ? "text.secondary" : "text.primary" }}>
                        {meta.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.5 }}>
                        {notification.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notification.createdAt).toLocaleDateString("ko-KR")}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Drawer>

      <Dialog open={!!joinDialog} onClose={() => setJoinDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>파티 가입 신청</DialogTitle>
        <DialogContent>
          <Typography>이 가입 신청을 승인하거나 거절할 수 있어요.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
          <Button onClick={() => setJoinDialog(null)} size="large">취소</Button>
          <Button onClick={handleReject} variant="outlined" color="error" size="large" sx={{ fontWeight: 600 }}>거절</Button>
          <Button onClick={handleApprove} variant="contained" size="large" sx={{ fontWeight: 600 }}>승인</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}