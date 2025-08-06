"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Plus, Send, Upload, CheckCircle, AlertTriangle, MessageSquarePlus, Loader2, Circle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { chatbotAssistance, ChatbotAssistanceInput } from "@/ai/flows/chatbot-assistance";
import { useToast } from "@/hooks/use-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatStatus = 'solved' | 'persistent';

type SavedChat = {
  id: string;
  title: string;
  status: ChatStatus | null;
};

const initialMessages: Message[] = [
  { role: "assistant", content: "Hola, soy Mecan IA. Describe el problema que estás experimentando con la maquinaria." },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(() => `chat_${Date.now()}`);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const chatHistoryForApi = newMessages.slice(1, -1).map(msg => ({ // a partir del 1 para no mandar el mensaje inicial
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

      const assistanceInput: ChatbotAssistanceInput = {
        userQuery: currentInput,
        chatHistory: chatHistoryForApi.length > 0 ? chatHistoryForApi : undefined,
      };

      const result = await chatbotAssistance(assistanceInput);
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.response },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateChatStatus = (status: ChatStatus) => {
    if (!currentChatId) return;

    const chatTitle = messages.find(m => m.role === 'user')?.content.substring(0, 30) + '...' || 'Nuevo Chat';
    
    setSavedChats(prev => {
        const existingChat = prev.find(c => c.id === currentChatId);
        if (existingChat) {
            return prev.map(c => c.id === currentChatId ? { ...c, status } : c);
        } else {
            return [...prev, { id: currentChatId, title: chatTitle, status }];
        }
    });

    toast({
      title: "Estado actualizado",
      description: `El chat se ha marcado como ${status === 'solved' ? 'solucionado' : 'persistente'}.`,
    });
  };

  const startNewChat = () => {
    setMessages(initialMessages);
    setCurrentChatId(`chat_${Date.now()}`);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
              viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);

  return (
    <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-10rem)]">
      <div className="lg:col-span-3 lg:block hidden">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Acciones del Chat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => updateChatStatus('solved')} className="w-full bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="mr-2 h-4 w-4" /> Marcar como solucionado
            </Button>
            <Button onClick={() => updateChatStatus('persistent')} variant="destructive" className="w-full">
              <AlertTriangle className="mr-2 h-4 w-4" /> Marcar como persistente
            </Button>
            <Separator className="my-6" />
            <h3 className="font-semibold text-base">Chats Guardados</h3>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {savedChats.map(chat => (
                  <div key={chat.id} className="flex items-center text-sm p-2 rounded-md hover:bg-secondary/80">
                    {chat.status === 'solved' && <Circle className="mr-2 h-3 w-3 text-green-500 fill-green-500" />}
                    {chat.status === 'persistent' && <Circle className="mr-2 h-3 w-3 text-red-500 fill-red-500" />}
                    <span className="flex-1 truncate">{chat.title}</span>
                  </div>
                ))}
                {savedChats.length === 0 && (
                    <p className="text-xs text-muted-foreground">No hay chats guardados.</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-6 flex flex-col h-full">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-center text-2xl">Mecan IA</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="space-y-6 p-4">
                {messages.map((message, index) => (
                  <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : '')}>
                    {message.role === 'assistant' && (
                      <Avatar className="h-9 w-9 border bg-background">
                        <AvatarFallback><Bot className="h-5 w-5 text-primary"/></AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn("rounded-xl p-3 max-w-[80%]", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
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
                 {isLoading && (
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 border bg-background">
                      <AvatarFallback><Bot className="h-5 w-5 text-primary"/></AvatarFallback>
                    </Avatar>
                    <div className="rounded-xl p-3 max-w-[80%] bg-secondary">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm">Analizando...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <div className="p-4 border-t bg-background">
            <div className="relative">
              <Textarea
                placeholder="Escribe tu mensaje aquí..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="pr-24 py-3"
                rows={1}
                disabled={isLoading}
              />
              <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1">
                 <Button variant="ghost" size="icon" disabled={isLoading}>
                    <Plus className="h-5 w-5" />
                 </Button>
                <Button onClick={handleSend} size="icon" disabled={isLoading}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-3 lg:block hidden">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Upload className="mr-2 h-4 w-4" /> Subir Captura
            </Button>
          </CardHeader>
          <CardContent className="flex-1 space-y-2 overflow-hidden">
             <h3 className="font-semibold text-sm mb-2">Maquinaria Relacionada</h3>
             <p className="text-sm text-muted-foreground">Motor, cojinetes</p>
          </CardContent>
          <div className="p-4 mt-auto border-t">
              <Button onClick={startNewChat} variant="secondary" className="w-full">
                  <MessageSquarePlus className="mr-2 h-4 w-4" /> Nuevo Chat
              </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
