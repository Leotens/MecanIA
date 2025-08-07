"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login page
    router.replace('/login');
  }, [router]);

  // You can show a loading spinner here if you want
  return null;
}

    