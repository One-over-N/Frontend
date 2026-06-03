import { Box, TextField, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Logo } from "../components/Logo";
import { API_URL } from "../utils/auth";

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nickname }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "회원가입 실패");
        return;
      }
      alert("회원가입 완료! 로그인해주세요.");
      navigate("/login");
    } catch (err) {
      alert("서버 오류");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        px: 3,
      }}
    >
      <Box sx={{ maxWidth: 400, width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1, "& > div": { transform: "scale(1.3)" } }}>
          <Logo />
        </Box>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: "center", mb: 5 }}
        >
          OTT를 저렴하게 이용하세요
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            required
            InputProps={{ sx: { fontSize: "1rem" } }}
          />
          <TextField
            fullWidth
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            sx={{ mb: 2 }}
            required
            InputProps={{ sx: { fontSize: "1rem" } }}
          />
          <TextField
            fullWidth
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            required
            InputProps={{ sx: { fontSize: "1rem" } }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ py: 1.75, fontSize: "1.125rem", fontWeight: 700, mb: 2 }}
          >
            회원가입
          </Button>
        </Box>

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            이미 계정이 있으신가요?
          </Typography>
          <Button
            component={Link}
            to="/login"
            sx={{ mt: 1, color: "primary.main", fontWeight: 600 }}
          >
            로그인하기
          </Button>
        </Box>
      </Box>
    </Box>
  );
}