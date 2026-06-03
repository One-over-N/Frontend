import {
  Box, Typography, Card, CardContent, Grid, Button, Tabs, Tab,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  CreditCard as CreditCardIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getToken, authHeaders, API_URL } from "../utils/auth";

function getTrustColor(trust: number) {
  if (trust >= 80) return { color: "#10B981", bgcolor: "#10B98115" };
  if (trust >= 60) return { color: "#F59E0B", bgcolor: "#F59E0B15" };
  return { color: "#EF4444", bgcolor: "#EF444415" };
}

export function PartyManagement() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [myParties, setMyParties] = useState<any[]>([]);
  const [joinedParties, setJoinedParties] = useState<any[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState<any>(null);
  const [editedOttId, setEditedOttId] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [editedBankName, setEditedBankName] = useState("");
  const [editedAccount, setEditedAccount] = useState("");
  const [partyDetails, setPartyDetails] = useState<{ [key: number]: any }>({});

  useEffect(() => {
    if (!getToken()) { navigate("/login"); return; }
    fetch(`${API_URL}/api/ott-service/parties/my`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setMyParties(d.result ?? []));
    fetch(`${API_URL}/api/ott-service/parties/joined`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setJoinedParties(d.result ?? []));
  }, [navigate]);

  const loadPartyDetail = async (partyId: number) => {
    if (partyDetails[partyId]) return;
    const res = await fetch(`${API_URL}/api/ott-service/parties/${partyId}`, { headers: authHeaders() });
    const data = await res.json();
    setPartyDetails(prev => ({ ...prev, [partyId]: data.result }));
  };

  const handleEdit = (party: any) => {
    setSelectedParty(party);
    setEditedOttId("");
    setEditedPassword("");
    setEditedBankName("");
    setEditedAccount("");
    setEditDialogOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>파티</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>파티를 관리하고 멤버를 확인하세요</Typography>

      <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3, "& .MuiTab-root": { fontWeight: 600, fontSize: "1rem" } }}>
        <Tab label="내가 만든 파티" />
        <Tab label="참여 중인 파티" />
      </Tabs>

      {tabValue === 0 && (
        <Grid container spacing={2}>
          {myParties.length === 0 ? (
            <Typography sx={{ p: 3, color: "text.secondary" }}>만든 파티가 없습니다.</Typography>
          ) : myParties.map((party: any) => (
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={0} sx={{ border: "2px solid #F3F4F6" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{party.partyName}</Typography>
                      <Typography variant="body2" color="text.secondary">{party.planName}</Typography>
                    </Box>
                    <Button startIcon={<EditIcon />} onClick={() => handleEdit(party)} variant="outlined" sx={{ fontWeight: 600, flexShrink: 0 }}>
                      정보 수정
                    </Button>
                  </Box>

                  <Box sx={{ p: 2, mb: 2, bgcolor: "background.default", borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">현재 인원</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {party.currentMemberCount} / {party.maxPeople}명
                    </Typography>
                  </Box>

                  <Button
                    fullWidth variant="outlined" size="small"
                    onClick={() => loadPartyDetail(party.partyId)}
                    sx={{ fontWeight: 600 }}
                  >
                    멤버 목록 보기
                  </Button>

                  {partyDetails[party.partyId] && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>파티원</Typography>
                      {partyDetails[party.partyId].partyMembers?.map((m: any, i: number) => {
                        const trustInfo = getTrustColor(m.reliabilityScore);
                        return (
                          <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1, px: 2, mb: 1, bgcolor: "background.default", borderRadius: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{m.nickname}</Typography>
                              {m.isLeader && <Chip label="방장" size="small" color="primary" sx={{ height: 18, fontSize: "0.65rem" }} />}
                            </Box>
                            <Box sx={{ px: 1.5, py: 0.25, borderRadius: 1, bgcolor: trustInfo.bgcolor }}>
                              <Typography variant="caption" sx={{ fontWeight: 700, color: trustInfo.color }}>
                                {m.reliabilityScore}점
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={2}>
          {joinedParties.length === 0 ? (
            <Typography sx={{ p: 3, color: "text.secondary" }}>참여 중인 파티가 없습니다.</Typography>
          ) : joinedParties.map((party: any) => (
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={0} sx={{ border: "2px solid #F3F4F6" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{party.partyName}</Typography>
                      <Typography variant="body2" color="text.secondary">{party.planName}</Typography>
                    </Box>
                    <Button startIcon={<CreditCardIcon />} size="small" variant="outlined" onClick={() => navigate("/payments")} sx={{ fontWeight: 600, flexShrink: 0 }}>
                      정산 확인
                    </Button>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">현재 인원</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {party.currentMemberCount} / {party.maxPeople}명
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>파티 정보 수정</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="OTT ID" value={editedOttId} onChange={(e) => setEditedOttId(e.target.value)} sx={{ mt: 2, mb: 2 }} />
          <TextField fullWidth label="OTT 비밀번호" type="password" value={editedPassword} onChange={(e) => setEditedPassword(e.target.value)} sx={{ mb: 2 }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>은행</InputLabel>
            <Select value={editedBankName} onChange={(e) => setEditedBankName(e.target.value)} label="은행">
              {["국민은행","신한은행","우리은행","하나은행","카카오뱅크","토스뱅크"].map(b => (
                <MenuItem key={b} value={b}>{b}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField fullWidth label="계좌번호" value={editedAccount} onChange={(e) => setEditedAccount(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setEditDialogOpen(false)} size="large">취소</Button>
          <Button variant="contained" size="large" sx={{ fontWeight: 600 }}
            onClick={() => { alert("파티 수정 API 미구현"); setEditDialogOpen(false); }}>
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}