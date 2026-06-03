import { Box, Typography, Grid, Card, CardContent, TextField, Button, LinearProgress, Avatar } from "@mui/material";
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, Edit as EditIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getToken, removeToken, authHeaders, API_URL } from "../utils/auth";

export function MyPage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [trustScore, setTrustScore] = useState(50);
  const [trustHistory, setTrustHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!getToken()) { navigate("/login"); return; }
    fetch(`${API_URL}/api/members/mypage`, {
      headers: authHeaders(),
    })
      .then((r) => r.json())
      .then((data) => {
        const d = data.result;
        setNickname(d.nickname);
        setEmail(d.email);
        setTrustScore(d.reliabilityScore);
        setTrustHistory(d.reliabilityHistories ?? []);
      })
      .catch(() => alert("정보 불러오기 실패"));
  }, [navigate]);

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/api/members/mypage/profile`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ nickname, email }),
      });
      if (!res.ok) { alert("수정 실패"); return; }
      setIsEditing(false);
    } catch { alert("서버 오류"); }
  };

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  const getTrustColor = (score: number) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>마이페이지</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Card elevation={0} sx={{ border: "2px solid #F3F4F6" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ width: 64, height: 64, bgcolor: "#EDE9FE", color: "#6D28D9", fontSize: "1.5rem", fontWeight: 700 }}>
                    {nickname.charAt(0)}
                  </Avatar>
                  <Box>
                    {isEditing ? (
                      <>
                        <TextField value={nickname} onChange={(e) => setNickname(e.target.value)} size="small" sx={{ mb: 1, display: "block" }} helperText="2~20자, 한글/영문/숫자만" />
                        <TextField value={email} onChange={(e) => setEmail(e.target.value)} size="small" type="email" sx={{ display: "block" }} />
                      </>
                    ) : (
                      <>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{nickname}</Typography>
                        <Typography variant="body2" color="text.secondary">{email}</Typography>
                      </>
                    )}
                  </Box>
                </Box>
                {isEditing ? (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button variant="contained" onClick={handleSave} size="small" sx={{ fontWeight: 600 }}>저장</Button>
                    <Button variant="outlined" onClick={() => setIsEditing(false)} size="small">취소</Button>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setIsEditing(true)} sx={{ fontWeight: 600 }}>정보 수정</Button>
                    <Button variant="outlined" color="error" onClick={handleLogout} sx={{ fontWeight: 600 }}>로그아웃</Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: "2px solid #F3F4F6" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>내 신뢰도</Typography>
              <Typography variant="caption" color="text.secondary">현재 점수</Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: getTrustColor(trustScore) }}>
                {trustScore}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={trustScore}
                sx={{ height: 8, borderRadius: 2, bgcolor: "#F3F4F6", mb: 3, "& .MuiLinearProgress-bar": { bgcolor: getTrustColor(trustScore), borderRadius: 2 } }}
              />
              <Typography variant="caption" color="text.secondary">기본 50점 · 성공 +5 · 미납 -10</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: "2px solid #F3F4F6" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>변동 이력</Typography>
              {trustHistory.length === 0 ? (
                <Typography variant="body2" color="text.secondary">변동 이력이 없습니다.</Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {trustHistory.map((item, index) => (
                    <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: item.changeScore >= 0 ? "#10B98115" : "#EF444415", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {item.changeScore >= 0
                          ? <TrendingUpIcon sx={{ color: "#10B981", fontSize: 20 }} />
                          : <TrendingDownIcon sx={{ color: "#EF4444", fontSize: 20 }} />}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>{item.reason}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: item.changeScore >= 0 ? "#10B981" : "#EF4444", flexShrink: 0 }}>
                        {item.changeScore >= 0 ? "+" : ""}{item.changeScore}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}