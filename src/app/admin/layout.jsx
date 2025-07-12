"use client"
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Box } from "@mui/material";

export default function Layout({ children }) {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar />
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
