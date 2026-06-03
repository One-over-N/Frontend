import { Box, Typography } from "@mui/material";

export function Logo() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography
        variant="h6"
        sx={{
          color: "primary.main",
          fontWeight: 700,
          fontSize: "1.5rem",
          letterSpacing: "-0.02em",
        }}
      >
        엔분의일
      </Typography>
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: 1.5,
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          lineHeight: 1,
          fontSize: "0.65rem",
        }}
      >
        <Box>1</Box>
        <Box sx={{ width: "12px", height: "1px", bgcolor: "white", my: "1px" }} />
        <Box sx={{ fontStyle: "italic" }}>n</Box>
      </Box>
    </Box>
  );
}
