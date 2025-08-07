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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = { username, email, password };
    const savedUsers = localStorage.getItem("users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    const userExists = users.some((user: any) => user.email === email);

    if (userExists) {
        toast({ title: "Error de registro", description: "El correo electrónico ya está en uso.", variant: "destructive" });
        return;
    }

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    toast({ title: "Registro exitoso", description: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión." });
    router.push('/login');
  };

  return (
    <Card className="w-full max-w-sm">
      <form onSubmit={handleRegister}>
        <CardHeader>
          <CardTitle className="text-2xl">Registro</CardTitle>
          <CardDescription>
            Crea una cuenta para empezar a usar Mecan IA.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Nombre de Usuario</Label>
            <Input id="username" type="text" placeholder="Tu nombre" required value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" placeholder="nombre@ejemplo.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full" type="submit">Crear Cuenta</Button>
           <p className="mt-4 text-xs text-center text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="underline">
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
