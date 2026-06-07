import { Box, Typography, Grid, Card, CardContent, CardActionArea } from "@mui/material";
import { ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { API_URL } from "../utils/auth";

interface BackendService {
  id: number;
  serviceName: string;
  imageUrl: string;
}

const getColorByName = (name: string) => {
  const upperName = name ? name.toUpperCase() : "";
  if (upperName.includes("NETFLIX")) return "#E50914";
  if (upperName.includes("DISNEY")) return "#113CCF";
  if (upperName.includes("WAVVE")) return "#00C9FF";
  if (upperName.includes("TVING") || upperName.includes("티빙")) return "#FF153C";
  if (upperName.includes("WATCHA") || upperName.includes("왓챠")) return "#FF0558";
  if (upperName.includes("COUPANG") || upperName.includes("쿠팡")) return "#4A90E2";
  return "#6D28D9"; 
};

export function Home() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${API_URL}/api/otts`) 
      .then((res) => {
        if (!res.ok) throw new Error("네트워크 응답에 문제가 있습니다.");
        return res.json();
      })
      .then((data) => {
        if (data && data.result && Array.isArray(data.result)) {
          const mapped = data.result.map((service: BackendService) => ({
            id: service.id,
            name: service.serviceName || "OTT 서비스",
            logo: service.imageUrl ? `${API_URL}${service.imageUrl}` : "🎬",
            color: getColorByName(service.serviceName || ""),
          }));
          setServices(mapped);
        } else {
          setServices([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("OTT 목록 로딩 실패:", err);
        setServices([
          { id: 1, name: "Netflix", logo: "🍿", color: "#E50914" },
          { id: 2, name: "Disney+", logo: "🏰", color: "#113CCF" },
          { id: 3, name: "웨이브", logo: "🌊", color: "#00C9FF" },
          { id: 4, name: "티빙", logo: "📺", color: "#FF153C" },
          { id: 5, name: "Coupang Play", logo: "🚀", color: "#4A90E2" },
          { id: 6, name: "왓챠", logo: "🎥", color: "#FF0558" },
        ]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">OTT 서비스 목록을 불러오는 중...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, mt: 2 }}>
        함께 쓰면 더 좋아요
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        원하는 OTT를 골라 파티에 참여하세요
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
        전체 OTT 서비스
      </Typography>
      
      <Grid container spacing={2}>
        {services.map((service, index) => {
          const uniqueKey = service.id || `ott-fallback-${index}`;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                elevation={0}
                sx={{
                  border: "2px solid #F3F4F6",
                  transition: "all 0.2s",
                  height: "100%",
                  "&:hover": {
                    borderColor: "primary.main",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(109, 40, 217, 0.1)",
                  },
                }}
              >
                <CardActionArea component={Link} to={`/services/${uniqueKey}`} sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 3, height: "100%", display: "flex", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 3,
                            bgcolor: `${service.color}15`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.5rem",
                            flexShrink: 0,
                          }}
                        >
                          {service.logo}
                        </Box>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {service.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            파티 참여
                          </Typography>
                        </Box>
                      </Box>
                      <ChevronRightIcon sx={{ color: "text.secondary" }} />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}