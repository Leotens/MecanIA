"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      const users = JSON.parse(savedUsers);
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        toast({ title: "Inicio de sesión exitoso." });
        router.push('/dashboard');
      } else {
        toast({ title: "Error", description: "Credenciales incorrectas.", variant: "destructive" });
      }
    } else {
      toast({ title: "Error", description: "No hay usuarios registrados.", variant: "destructive" });
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <form onSubmit={handleLogin}>
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" placeholder="nombre@ejemplo.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full" type="submit">Acceder</Button>
          <p className="mt-4 text-xs text-center text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="underline">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
