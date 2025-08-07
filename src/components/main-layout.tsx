"use client";

import { usePathname } from 'next/navigation';
import AuthLayout from "@/app/(auth)/layout";
import MainLayoutContent from "./main-layout-content";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  if (isAuthRoute) {
    return <AuthLayout>{children}</AuthLayout>;
  }

  return <MainLayoutContent>{children}</MainLayoutContent>;
}
