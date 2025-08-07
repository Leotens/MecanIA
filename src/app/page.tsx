"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// For this prototype, we'll assume the user is "logged in"
// and we can show them the main dashboard.
// In a real app, you'd have auth checks here.
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return null; 
}
