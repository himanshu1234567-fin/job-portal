"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CreativeUserHeader from "./UserHeader/page";
import Sidebar from "/src/components/Sidebar";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";

export default function UserDashboardPage() {
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const profileComplete = JSON.parse(localStorage.getItem("profileComplete"));

    if (profileComplete === false || profileComplete === null) {
      setShowAlert(true);
    }
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const goToProfile = () => {
    router.push("/user/profile"); // replace with your actual route if different
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main Content on the right */}
      <Box sx={{ flexGrow: 1, px: 4, py: 3 }}>
        {/* Alert for Incomplete Profile */}
        <Snackbar
          open={showAlert}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="warning"
            sx={{ width: "100%" }}
            action={
              <Button color="inherit" size="small" onClick={goToProfile}>
                Update Now
              </Button>
            }
          >
            Your profile is incomplete. Please update it.
          </Alert>
        </Snackbar>

        {/* Creative Header */}
        <CreativeUserHeader />

        {/* Link-based Navigation */}
        <Box sx={{ display: "flex", gap: 4, mt: 3 }}>
          <Link href="/dashboard/preferences" passHref>
            <Typography sx={{ cursor: "pointer", fontWeight: 500 }}>
              Preferences
            </Typography>
          </Link>
          <Link href="/dashboard/saved-jobs" passHref>
            <Typography sx={{ cursor: "pointer", fontWeight: 500 }}>
              Saved Jobs
            </Typography>
          </Link>
          <Link href="/dashboard/applications" passHref>
            <Typography sx={{ cursor: "pointer", fontWeight: 500 }}>
              Applications
            </Typography>
          </Link>
          <Link href="/dashboard/settings" passHref>
            <Typography sx={{ cursor: "pointer", fontWeight: 500 }}>
              Settings
            </Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
