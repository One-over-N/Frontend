import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router";
import { SentimentDissatisfied as SadIcon } from "@mui/icons-material";
import { setToken, API_URL } from "../utils/auth";

export function NotFound() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <SadIcon sx={{ fontSize: 100, color: "text.secondary", mb: 2 }} />
      <Typography variant="h3" gutterBottom>
        404
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        페이지를 찾을 수 없습니다
      </Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
        홈으로 돌아가기
      </Button>
    </Box>
  );
}
