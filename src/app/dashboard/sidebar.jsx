'use client';

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const drawerWidth = 240;

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Candidates', path: '/dashboard/candidate', icon: <PeopleIcon /> },
  { label: 'Jobs', path: '/dashboard/jobs', icon: <WorkIcon /> },
  { label: 'Settings', path: '/admin/settings', icon: <SettingsIcon /> },
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f5f7fb',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {navItems.map((item) => (
            <Link href={item.path} key={item.label} passHref legacyBehavior>
              <ListItemButton
                selected={pathname === item.path}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  mb: 1,
                  color: pathname === item.path ? '#1976d2' : 'inherit',
                  backgroundColor: pathname === item.path ? '#e3f2fd' : 'transparent',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
