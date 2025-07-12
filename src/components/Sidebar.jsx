"use client"

import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Toolbar
} from "@mui/material";
import {
  Dashboard, Work, Mail, BarChart, Menu as MenuIcon, Home
} from "@mui/icons-material";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => setOpen(!open);

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? 200 : 60,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 200 : 60,
          transition: 'width 0.3s',
          overflowX: 'hidden',
          whiteSpace: 'nowrap',
        },
      }}
    >
      <Toolbar>
        <IconButton onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <List>
        {[{ icon: <Dashboard />, label: 'Dashboard' },
          { icon: <Work />, label: 'Search Job' },
          { icon: <Mail />, label: 'Applications' },
          { icon: <BarChart />, label: 'Statistics' },
          { icon: <Home />, label: 'Home' },
        ].map((item, index) => (
          <ListItem button key={index}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            {open && <ListItemText primary={item.label} />}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
