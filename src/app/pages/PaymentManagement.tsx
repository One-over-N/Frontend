import { Box, Typography, Card, CardContent, Grid, Button } from "@mui/material";
import { TrendingDown as TrendingDownIcon, CheckCircle as CheckCircleIcon, Schedule as ScheduleIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { getToken, authHeaders, API_URL } from "../utils/auth";
import { useNavigate } from "react-router";

function getDday(targetDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(targetDate);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const now = new Date();
const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

export function PaymentManagement() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!getToken()) { navigate("/login"); return; }

    fetch(`${API_URL}/api/settlements/current`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => {
  const raw = d.result;
  if (Array.isArray(raw)) setPayments(raw);
  else if (raw?.dataList && Array.isArray(raw.dataList)) setPayments(raw.dataList);
  else if (raw?.content && Array.isArray(raw.content)) setPayments(raw.content);
  else setPayments([]);
})
      .catch(() => setPayments([]));

    fetch(`${API_URL}/api/settlements/summary`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setSummary(d.result ?? null))
      .catch(() => {});

    fetch(`${API_URL}/api/settlements/history`, { headers: authHeaders() })
  .then(r => r.json())
  .then(d => {
    const raw = d.result;
    if (Array.isArray(raw)) setHistory(raw);
    else if (raw?.dataList && Array.isArray(raw.dataList)) setHistory(raw.dataList);
    else if (raw?.content && Array.isArray(raw.content)) setHistory(raw.content);
    else setHistory([]);
  })
  .catch(() => setHistory([]));
  }, []);

  const handleSettle = async (memberPaymentId: number) => {
    await fetch(`${API_URL}/api/settlements/${memberPaymentId}/status`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify("PAID"),
    });
    setPayments(prev => prev.map(p => p.memberPaymentId === memberPaymentId ? { ...p, paymentStatus: "PAID" } : p));
    setSummary((prev: any) => prev ? { ...prev, completedPaymentCount: prev.completedPaymentCount + 1 } : prev);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>정산</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>파티 경제 현실화 절약 금액을 확인하세요</Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ border: "2px solid #6D28D9", background: "linear-gradient(135deg, #6D28D9 0%, #DB2777 100%)", color: "white" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>이번 달 납부 금액</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                {(summary?.currentMonthBillingAmount ?? 0).toLocaleString()}원
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ border: "2px solid #F3F4F6" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <TrendingDownIcon sx={{ color: "success.main" }} />
                <Typography variant="body2" color="text.secondary">절약 금액</Typography>
              </Box>
              <Typography variant="h3" color="success.main" sx={{ fontWeight: 800 }}>
                {(summary?.savedAmount ?? 0).toLocaleString()}원
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ border: "2px solid #F3F4F6" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>납부 완료</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                {summary?.completedPaymentCount ?? 0} / {summary?.totalPaymentCount ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>이번 달 정산 ({currentMonth})</Typography>
        {payments.length === 0 ? (
          <Typography color="text.secondary">이번 달 정산 내역이 없습니다.</Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {payments.map((payment: any) => (
              <Card key={payment.memberPaymentId} elevation={0} sx={{ border: "2px solid #F3F4F6" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                        📺
                      </Box>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.25 }}>{payment.partyName}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
                          {payment.ottName} {payment.planName}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#6D28D9" }}>
                            {payment.paymentAmount?.toLocaleString()}원
                          </Typography>
                          {payment.paymentStatus === "UNPAID" && payment.targetDate && (() => {
                            const dday = getDday(payment.targetDate);
                            return (
                              <>
                                <Typography variant="caption" color="text.secondary">기한 {payment.targetDate}</Typography>
                                {dday <= 3 && (
                                  <Box sx={{ px: 1, py: 0.1, borderRadius: 1, bgcolor: "#EF444415" }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#EF4444" }}>
                                      {dday <= 0 ? "기한 초과" : `D-${dday}`}
                                    </Typography>
                                  </Box>
                                )}
                              </>
                            );
                          })()}
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {payment.paymentStatus === "PAID" ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 2, py: 0.75, borderRadius: 2, bgcolor: "#10B98115", color: "success.main" }}>
                          <CheckCircleIcon fontSize="small" />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>완료</Typography>
                        </Box>
                      ) : (
                        <>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 2, py: 0.75, borderRadius: 2, bgcolor: "#F59E0B15", color: "warning.main" }}>
                            <ScheduleIcon fontSize="small" />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>대기중</Typography>
                          </Box>
                          <Button variant="contained" size="small" sx={{ fontWeight: 600, px: 2, py: 0.5 }} onClick={() => handleSettle(payment.memberPaymentId)}>
                            정산
                          </Button>
                        </>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>전체 납부 기록</Typography>
        {history.length === 0 ? (
          <Typography color="text.secondary">납부 기록이 없습니다.</Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {history.map((payment: any) => (
              <Box key={payment.memberPaymentId} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2.5, bgcolor: "background.default", borderRadius: 2 }}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>{payment.partyName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {payment.paidAt?.slice(0, 10)} · {payment.ottName} {payment.planName}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{payment.paymentAmount?.toLocaleString()}원</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}