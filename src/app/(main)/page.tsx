"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Circle } from "lucide-react";
import { useRouter } from "next/navigation";

type ChatStatus = 'solved' | 'persistent' | 'pending';

type Chat = {
  id: string;
  title: string;
  status: ChatStatus;
  lastReport: string;
};

export default function Dashboard() {
  const [recentProblems, setRecentProblems] = useState<Chat[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedChats = localStorage.getItem("savedChats");
    if (savedChats) {
      try {
        const parsedChats: Chat[] = JSON.parse(savedChats);
        setRecentProblems(parsedChats);
      } catch (error) {
        console.error("Error parsing saved chats:", error);
      }
    }
  }, []);

  const handleNavigateToChat = (chatId: string) => {
    localStorage.setItem("currentChatId", JSON.stringify(chatId));
    router.push('/chat');
  };
  
  const getBadgeVariant = (status: ChatStatus) => {
    switch(status) {
      case 'solved': return 'secondary';
      case 'persistent': return 'destructive';
      case 'pending': return 'default';
      default: return 'outline';
    }
  }

  const getStatusText = (status: ChatStatus) => {
    switch(status) {
      case 'solved': return 'Solucionado';
      case 'persistent': return 'Persistente';
      case 'pending': return 'Pendiente';
      default: return 'Desconocido';
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center py-12 md:py-16">
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          Bienvenido a Mecan IA
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          El sistema de diagnóstico asistido por IA para maquinaria industrial. Su asistente experto para resolver problemas complejos de manera eficiente.
        </p>
        <Button asChild size="lg" className="font-bold text-lg">
          <Link href="/chat">
            Iniciar diagnóstico
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Problemas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problema</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último Reporte</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentProblems.length > 0 ? recentProblems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell className="font-medium">{problem.title}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(problem.status)}>
                      {getStatusText(problem.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{problem.lastReport}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleNavigateToChat(problem.id)} variant="outline" size="sm">
                      Ver detalle
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No hay problemas recientes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    