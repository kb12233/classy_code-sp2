import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingOverlay({ message = "Loading..." }) {  
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backdropFilter: "blur(8px)", // Blurred background
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999, // Ensure it's on top
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress sx={{ color: "#B4B4B4" }} size={50} />
        <Typography variant="h6" sx={{ color: "#fff", mt: 2, fontFamily: "JetBrains Mono" }}>
          {message} {/* Dynamically display the message */}
        </Typography>
      </Box>
    </Box>
  );
}