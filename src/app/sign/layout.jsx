'use client';

import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useRouter } from 'next/navigation';

export default function Sign({ children }) {
  const router = useRouter();

  return (
    <section className="min-h-screen bg-white">
      <IconButton
        onClick={() => router.push('/')}
        sx={{ position: 'absolute', top: 16}}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      {children}
    </section>
  );
}
