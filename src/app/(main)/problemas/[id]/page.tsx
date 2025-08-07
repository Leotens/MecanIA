"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ListChecks } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatStatus = 'solved' | 'persistent' | 'pending';

type Chat = {
  id: string;
  title: string;
  status: ChatStatus;
  messages: Message[];
  relatedMachinery: string;
  lastReport: string;
  aiAnalysis?: { possibleCauses: string[] };
};

export default function ProblemDetailPage({ params }: { params: { id: string } }) {
  const [problem, setProblem] = useState<Chat | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedChats = localStorage.getItem("savedChats");
    if (savedChats) {
      try {
        const parsedChats: Chat[] = JSON.parse(savedChats);
        const currentProblem = parsedChats.find(p => p.id === params.id);
        if (currentProblem) {
          // Simulate AI analysis if not present
          if (!currentProblem.aiAnalysis) {
            currentProblem.aiAnalysis = {
              possibleCauses: ["Nivel bajo de aceite", "Cojinetes dañados", "Bujías defectuosas", "Problema de combustión"]
            };
          }
          setProblem(currentProblem);
        }
      } catch (error) {
        console.error("Error loading problem details:", error);
      }
    }
  }, [params.id]);

  const handleNavigateToChat = () => {
    localStorage.setItem("currentChatId", JSON.stringify(params.id));
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

  if (!problem) {
    return <div>Cargando problema...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">{problem.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-2">
          <span>Reportado: {problem.lastReport}</span>
          <Separator orientation="vertical" className="h-4" />
          <Badge variant={getBadgeVariant(problem.status)}>{getStatusText(problem.status)}</Badge>
          <Separator orientation="vertical" className="h-4" />
          <span>Maquinaria: {problem.relatedMachinery}</span>
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
                        {problem.messages.map((message, index) => (
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
            {problem.aiAnalysis && (
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
            )}
            <Card>
                <CardHeader>
                    <CardTitle>Acciones</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-2">
                    <Button onClick={handleNavigateToChat}>Continuar diagnóstico</Button>
                    <Button variant="secondary">Asignar a técnico</Button>
                    <Button variant="outline" asChild><Link href="/dashboard">Volver al panel</Link></Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    