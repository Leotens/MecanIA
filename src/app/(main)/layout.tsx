import { Bot, PanelLeft } from "lucide-react";
import Link from "next/link";
import { UserNav } from "@/components/user-nav";
import { MainNav } from "@/components/main-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold"
          >
            <Bot className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl">Mecan IA</span>
          </Link>
          <MainNav />
        </nav>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold mb-4"
              >
                <Bot className="h-6 w-6 text-primary" />
                <span className="font-headline text-xl">Mecan IA</span>
              </Link>
              <Link href="/" className="hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/chat" className="text-muted-foreground hover:text-foreground">
                Iniciar Diagnóstico
              </Link>
               <Link href="/perfil" className="text-muted-foreground hover:text-foreground">
                Perfil
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <UserNav />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
        {children}
      </main>
    </div>
  );
}
