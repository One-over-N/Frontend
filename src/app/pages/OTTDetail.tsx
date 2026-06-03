import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { People as PeopleIcon, Hd as HdIcon } from "@mui/icons-material";
import { authHeaders } from "../utils/auth";

function getTrustColor(trust: number) {
  if (trust >= 80) return { color: "#10B981", bgcolor: "#10B98115", label: "우수" };
  if (trust >= 60) return { color: "#F59E0B", bgcolor: "#F59E0B15", label: "보통" };
  return { color: "#EF4444", bgcolor: "#EF444415", label: "주의" };
}

const getColorByName = (name: string) => {
  const upperName = name?.toUpperCase() || "";
  if (upperName.includes("NETFLIX")) return "#E50914";
  if (upperName.includes("DISNEY")) return "#113CCF";
  if (upperName.includes("WAVVE")) return "#00C9FF";
  if (upperName.includes("TVING") || upperName.includes("티빙")) return "#FF153C";
  if (upperName.includes("WATCHA") || upperName.includes("왓챠")) return "#FF0558";
  if (upperName.includes("COUPANG") || upperName.includes("쿠팡")) return "#4A90E2";
  return "#6D28D9"; 
};

const getOttMetaById = (id: number) => {
  const meta: Record<number, { name: string; color: string; logo: string }> = {
    1: { name: "Netflix", color: "#E50914", logo: "🍿" },
    2: { name: "Disney+", color: "#113CCF", logo: "🏰" },
    3: { name: "웨이브", color: "#00C9FF", logo: "🌊" },
    4: { name: "티빙", color: "#FF153C", logo: "📺" },
    5: { name: "Coupang Play", color: "#4A90E2", logo: "🚀" },
    6: { name: "왓챠", color: "#FF0558", logo: "🎥" },
  };
  return meta[id] || { name: "OTT 서비스", color: "#6D28D9", logo: "🎬" };
};

export function OTTDetail() {
  const params = useParams<{ serviceId: string }>();
  const currentId = Number(params.serviceId) || 1;
  const ottMeta = getOttMetaById(currentId);

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [partyDetailDialog, setPartyDetailDialog] = useState<{ party: any; plan: any } | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [partyName, setPartyName] = useState("");
  const [ottId, setOttId] = useState("");
  const [ottPassword, setOttPassword] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("${import.meta.env.VITE_API_URL}/api/otts").then((r) => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/otts/${currentId}/plans`).then((r) => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/ott-service/${currentId}/parties`, { headers: authHeaders() }).then((r) => r.json()),
    ])
      .then(([ottsData, plansData, partiesData]) => {
     const otts = ottsData.result ?? [];
     const plans = plansData.result ?? [];
     const parties = partiesData.result ?? [];
     const currentOtt = otts.find((o: any) => Number(o.id) === currentId);
        setService({
          name: currentOtt?.serviceName ?? ottMeta.name,
          color: getColorByName(currentOtt?.serviceName ?? ottMeta.name),
          logo: currentOtt?.imageUrl || ottMeta.logo,

          plans: plans.map((plan: any) => ({
            id: plan.id,
            name: plan.planName,
            price: plan.monthlyPrice,
            maxUsers: plan.maxMembers,
            perUser: Math.floor(plan.monthlyPrice / plan.maxMembers),
            quality: "UHD (4K)"
          })),

          parties: parties.map((party: any) => ({
            id: party.partyId,
            partyName: party.partyName,
            planName: party.planName,
            leaderTrust: party.leaderReliability || 80,
            currentUsers: party.currentMemberCount || 0,
            maxUsers: party.maxPeople || 4,
            perUser: party.monthlyPrice / (party.maxPeople || 4),
            members: []
          }))
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setService({
          name: ottMeta.name,
          color: ottMeta.color,
          logo: ottMeta.logo,
          plans: [
            { id: 1, name: "베이직", price: 9500, maxUsers: 1, perUser: 9500, quality: "SD (480p)" },
            { id: 2, name: "스탠다드", price: 13500, maxUsers: 2, perUser: 6750, quality: "FHD (1080p)" },
            { id: 3, name: "프리미엄", price: 17000, maxUsers: 4, perUser: 4250, quality: "UHD (4K)" },
          ],
          parties: []
        });
        setLoading(false);
      });
  }, [currentId, ottMeta.name, ottMeta.color, ottMeta.logo]);

  const handleCreateParty = () => {
    if (!selectedPlan || !partyName || !ottId || !ottPassword || !bankName || !accountNumber) {
      alert("모든 필드를 입력해줘!");
      return;
    }

    const reqBody = {
      partyName: partyName,
      ottAccountId: ottId,
      ottAccountPassword: ottPassword,
      bank: bankName,
      bankAccount: accountNumber
    };

    fetch(`${import.meta.env.VITE_API_URL}/api/ott-service/${currentId}/${selectedPlan}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody)
    })
    .then((res) => res.json())
    .then(() => {
      alert("디비에 파티 생성 완료!");
      setCreateDialogOpen(false);
      window.location.reload();
    })
    .catch((err) => {
      console.error(err);
    });
  };

  if (loading) {
    return <Typography sx={{ p: 4, textAlign: "center" }}>백엔드 리얼타임 데이터 수신 중...</Typography>;
  }

  if (!service) {
    return <Typography sx={{ p: 4, textAlign: "center" }}>데이터가 존재하지 않습니다.</Typography>;
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 3,
            bgcolor: `${service.color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            mr: 2,
          }}
        >
          {service.logo}
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {service.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            요금제를 선택하고 파티를 만들거나 참여하세요.
          </Typography>
        </Box>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 5, mb: 2 }}>
        요금제 스펙
      </Typography>
      <Grid container spacing={2}>
        {service.plans.map((plan: any) => (
          <Grid key={`plan-card-${plan.id}`} size={{ xs: 12, md: 4 }}>
            <Card
              elevation={0}
              sx={{
                border: "2px solid #F3F4F6",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: "0 4px 12px rgba(109, 40, 217, 0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  {plan.name}
                </Typography>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 800, mb: 0.5 }}>
                  {plan.price.toLocaleString()}원
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  월 이용료
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                    <PeopleIcon sx={{ color: "primary.main" }} />
                    <Typography variant="body2" color="text.secondary">
                      최대 {plan.maxUsers}명 공유
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                    <HdIcon sx={{ color: "primary.main" }} />
                    <Typography variant="body2" color="text.secondary">
                      {plan.quality}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 2, bgcolor: "primary.main", color: "white", borderRadius: 2, textAlign: "center", mb: 2 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                    1인당 최종 금액
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {plan.perUser.toLocaleString()}원
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    setCreateDialogOpen(true);
                  }}
                  sx={{ fontWeight: 600 }}
                >
                  파티 만들기
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 6, mb: 2 }}>
        디비에 개설된 파티 목록
      </Typography>
      <Grid container spacing={2}>
        {service.parties.length === 0 ? (
          <Typography sx={{ p: 3, color: "text.secondary" }}>현재 개설된 파티가 없습니다. 첫 파티를 만들어보세요!</Typography>
        ) : (
          service.parties.map((party: any, idx: number) => {
            const trustInfo = getTrustColor(party.leaderTrust);
            return (
              <Grid key={`party-card-${party.id || idx}`} size={{ xs: 12 }}>
                <Card
                  elevation={0}
                  sx={{
                    border: "2px solid #F3F4F6",
                    transition: "all 0.2s",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {party.partyName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {party.planName} 요금제
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          방장 신뢰 점수
                        </Typography>
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.5, py: 0.5, borderRadius: 2, bgcolor: trustInfo.bgcolor }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: trustInfo.color }}>
                            {party.leaderTrust}점
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          현재 인원
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {party.currentUsers}/{party.maxUsers}명
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          1인당 납부금
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {party.perUser.toLocaleString()}원
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 2 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <Button
                            variant="outlined"
                            fullWidth
                            size="small"
                            onClick={() => {
                              const plan = service.plans.find((p: any) => p.name === party.planName);
                              setPartyDetailDialog({ party, plan });
                            }}
                            sx={{ fontWeight: 600 }}
                          >
                            상세보기
                          </Button>
                          <Button variant="contained" fullWidth size="small" sx={{ fontWeight: 600 }}>
                            가입 신청
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>새 파티 모집 등록하기</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, p: 2, bgcolor: "info.light", borderRadius: 2, color: "info.contrastText", mt: 1 }}>
            <Typography variant="body2">모집 글 등록 후 파티원 인원이 모두 차면 자동으로 파티가 활성화됩니다.</Typography>
          </Box>
          <TextField fullWidth placeholder="파티 이름" value={partyName} onChange={(e) => setPartyName(e.target.value)} sx={{ mt: 2, mb: 2 }} required />
          <TextField fullWidth placeholder="OTT ID" value={ottId} onChange={(e) => setOttId(e.target.value)} sx={{ mb: 2 }} required />
          <TextField fullWidth placeholder="OTT 비밀번호" type="password" value={ottPassword} onChange={(e) => setOttPassword(e.target.value)} sx={{ mb: 2 }} required />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="bank-select-label">정산 은행명</InputLabel>
            <Select labelId="bank-select-label" value={bankName} onChange={(e) => setBankName(e.target.value)} label="은행명" required>
              <MenuItem value="국민은행">국민은행</MenuItem>
              <MenuItem value="신한은행">신한은행</MenuItem>
              <MenuItem value="우리은행">우리은행</MenuItem>
              <MenuItem value="하나은행">하나은행</MenuItem>
              <MenuItem value="카카오뱅크">카카오뱅크</MenuItem>
              <MenuItem value="토스뱅크">토스뱅크</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth placeholder="계좌번호" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} helperText="파티원들이 매달 정산금을 입금할 계좌번호입니다." required />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setCreateDialogOpen(false)} size="large">취소</Button>
          <Button onClick={handleCreateParty} variant="contained" size="large" sx={{ fontWeight: 600 }}>디비에 파티 등록</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}