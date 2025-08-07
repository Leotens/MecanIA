"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();
  const routes = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/chat", label: "Iniciar Diagnóstico" },
  ];

  return (
    <>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-muted-foreground transition-colors hover:text-foreground",
            (pathname.startsWith(route.href)) ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </>
  );
}
