
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ListChecks } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

type ChatStatus = 'solved' | 'persistent' | 'pending';

type Chat = {
  id: string;
  title: string;
  status: ChatStatus;
  relatedMachinery: string;
  lastReport: string;
};

export default function DashboardPage() {
  const [recentProblems, setRecentProblems] = useState<Chat[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedChats = localStorage.getItem("savedChats");
    if (savedChats) {
      try {
        const parsedChats: Chat[] = JSON.parse(savedChats);
        setRecentProblems(parsedChats);
      } catch (error) {
        console.error("Error loading recent problems:", error);
      }
    }
  }, []);

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

  const handleRowClick = (problemId: string) => {
    router.push(`/problemas/${problemId}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Panel de Control</h1>
          <p className="text-muted-foreground">Bienvenido, aquí tienes un resumen de la actividad reciente.</p>
        </div>
        <Button asChild>
          <Link href="/chat">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Diagnóstico
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Problemas Resueltos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-500">
              {recentProblems.filter(p => p.status === 'solved').length}
            </div>
            <p className="text-xs text-muted-foreground">en el último mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Problemas Persistentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-500">
              {recentProblems.filter(p => p.status === 'persistent').length}
            </div>
            <p className="text-xs text-muted-foreground">requieren atención</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Diagnósticos en Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-yellow-500">
              {recentProblems.filter(p => p.status === 'pending').length}
            </div>
             <p className="text-xs text-muted-foreground">actualmente abiertos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Problemas Recientes</CardTitle>
              <CardDescription>Estos son los últimos diagnósticos registrados en el sistema.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="#">
                Ver todos
                <ListChecks className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título del Problema</TableHead>
                <TableHead>Maquinaria</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último Reporte</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentProblems.slice(0, 5).map((problem) => (
                <TableRow key={problem.id} onClick={() => handleRowClick(problem.id)} className="cursor-pointer">
                  <TableCell className="font-medium">{problem.title}</TableCell>
                  <TableCell>{problem.relatedMachinery}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(problem.status)}>
                      {getStatusText(problem.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{problem.lastReport}</TableCell>
                </TableRow>
              ))}
              {recentProblems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No se han reportado problemas recientemente.
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
