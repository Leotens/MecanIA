import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const recentProblems = [
  { id: '1', name: "Ruido en motor", status: "Pendiente", lastReport: "2024-07-21" },
  { id: '2', name: "Fallo en sistema de frenos", status: "Solucionado", lastReport: "2024-07-20" },
  { id: '3', name: "Sobrecalentamiento", status: "Pendiente", lastReport: "2024-07-19" },
  { id: '4', name: "Vibración excesiva", status: "Solucionado", lastReport: "2024-07-18" },
  { id: '5', name: "Pérdida de potencia", status: "Pendiente", lastReport: "2024-07-22" },
];

export default function Dashboard() {
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
              {recentProblems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell className="font-medium">{problem.name}</TableCell>
                  <TableCell>
                    <Badge variant={problem.status === "Solucionado" ? "secondary" : "default"}>
                      {problem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{problem.lastReport}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/problemas/${problem.id}`}>Ver detalle</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
