"use client"
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Box } from "@mui/material";

export default function Layout({ children }) {
  return (
    <Box sx={{ display: "flex"}}>
      {/* <Sidebar /> */}
      <Box sx={{ flexGrow: 1 }}>
<<<<<<< HEAD
        
=======
        {/* <Topbar /> */}
>>>>>>> 5179fbaf5d8775956b4b494e2f2465524e80c8cc
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
