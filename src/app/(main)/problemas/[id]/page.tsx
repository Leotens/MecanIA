import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ListChecks } from "lucide-react";

const problemDetails = {
  id: 1,
  title: "Ruido extraño en el motor",
  reportDate: "2024-07-20",
  status: "Pendiente",
  relatedMachinery: ["Motor principal", "Transmisión", "Cojinetes"],
  chatHistory: [
    { role: "user", content: "El motor está haciendo un ruido raro." },
    { role: "assistant", content: "Hola. ¿Puedes describir el ruido? ¿Es un chirrido, un golpeteo o algo más?" },
    { role: "user", content: "Es un golpeteo metálico, sobre todo al acelerar." },
    { role: "assistant", content: "Entendido. Un golpeteo metálico al acelerar puede indicar varias cosas. ¿Has revisado el nivel de aceite recientemente?" },
  ],
  aiAnalysis: {
    possibleCauses: ["Nivel bajo de aceite", "Cojinetes dañados", "Bujías defectuosas", "Problema de combustión"]
  }
};

async function getProblemDetails(id: string) {
  // In a real app, you would fetch this from a database
  console.log(`Fetching details for problem: ${id}`);
  return problemDetails;
}


export default async function ProblemDetailPage({ params }: { params: { id: string } }) {
  const problem = await getProblemDetails(params.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">{problem.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-2">
          <span>Reportado: {problem.reportDate}</span>
          <Separator orientation="vertical" className="h-4" />
          <Badge variant={problem.status === "Solucionado" ? "secondary" : "default"}>{problem.status}</Badge>
          <Separator orientation="vertical" className="h-4" />
          <span>Maquinaria: {problem.relatedMachinery.join(', ')}</span>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Historial de Conversación</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {problem.chatHistory.map((message, index) => (
                        <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                            {message.role === 'assistant' && (
                            <Avatar className="h-9 w-9 border">
                                <AvatarFallback><Bot className="h-5 w-5 text-primary"/></AvatarFallback>
                            </Avatar>
                            )}
                            <div className={`rounded-xl p-3 max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                                <p className="text-sm">{message.content}</p>
                            </div>
                            {message.role === 'user' && (
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="person face" />
                                <AvatarFallback>CR</AvatarFallback>
                            </Avatar>
                            )}
                        </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                    <ListChecks className="h-6 w-6 text-primary" />
                    <CardTitle>Análisis Técnico Sugerido</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {problem.aiAnalysis.possibleCauses.map((cause, index) => (
                        <li key={index}>{cause}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Acciones</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-2">
                    <Button>Marcar como solucionado</Button>
                    <Button variant="secondary">Asignar a técnico</Button>
                    <Button variant="outline" asChild><Link href="/">Volver al panel</Link></Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
