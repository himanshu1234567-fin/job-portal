"use client"
import Layout from "@/app/admin/layout";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { useState } from "react";

export default function DashboardPage() {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => setTab(newValue);

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}><Typography>{children}</Typography></Box>}
    </div>
  );

  return (
    <Layout>
      <Tabs value={tab} onChange={handleChange} sx={{ mb: 2 }}>
        <Tab label="Preferences" />
        <Tab label="Saved Jobs" />
        <Tab label="Applications" />
        <Tab label="Settings" />
      </Tabs>

      <TabPanel value={tab} index={0}>Preferences details here...</TabPanel>
      <TabPanel value={tab} index={1}>List of saved jobs...</TabPanel>
      <TabPanel value={tab} index={2}>Applications history...</TabPanel>
      <TabPanel value={tab} index={3}>User settings...</TabPanel>
    </Layout>
  );
}
