"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Plus, Send, Upload, CheckCircle, AlertTriangle, MessageSquarePlus, Loader2, Circle, Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { chatbotAssistance, ChatbotAssistanceInput } from "@/ai/flows/chatbot-assistance";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatStatus = 'solved' | 'persistent';

type Chat = {
  id: string;
  title: string;
  status: ChatStatus | null;
  messages: Message[];
  relatedMachinery: string;
};

const initialMessages: Message[] = [
  { role: "assistant", content: "Hola, soy Mecan IA. Describe el problema que estás experimentando con la maquinaria." },
];

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isEditTitleModalOpen, setIsEditTitleModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isEditMachineryModalOpen, setIsEditMachineryModalOpen] = useState(false);
  const [newMachinery, setNewMachinery] = useState("");

  useEffect(() => {
    const savedChats = localStorage.getItem("savedChats");
    const savedCurrentChatId = localStorage.getItem("currentChatId");

    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }

    if (savedCurrentChatId) {
      setCurrentChatId(JSON.parse(savedCurrentChatId));
    } else {
      startNewChat();
    }
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("savedChats", JSON.stringify(chats));
    }
    if (currentChatId) {
      localStorage.setItem("currentChatId", JSON.stringify(currentChatId));
    }
  }, [chats, currentChatId]);
  
  const currentChat = chats.find(chat => chat.id === currentChatId);

  const handleSend = async () => {
    if (input.trim() === "" || !currentChat) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...currentChat.messages, userMessage];
    updateChat(currentChatId, { messages: updatedMessages });

    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const chatHistoryForApi = updatedMessages.slice(1, -1).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

      const assistanceInput: ChatbotAssistanceInput = {
        userQuery: currentInput,
        chatHistory: chatHistoryForApi.length > 0 ? chatHistoryForApi : undefined,
      };

      const result = await chatbotAssistance(assistanceInput);
      
      const assistantMessage: Message = { role: "assistant", content: result.response };
      updateChat(currentChatId, { messages: [...updatedMessages, assistantMessage] });

    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage: Message = { role: "assistant", content: "Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo." };
      updateChat(currentChatId, { messages: [...updatedMessages, errorMessage] });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateChat = (chatId: string, updates: Partial<Chat>) => {
    setChats(prevChats => prevChats.map(chat =>
      chat.id === chatId ? { ...chat, ...updates } : chat
    ));
  };
  
  const updateChatStatus = (status: ChatStatus) => {
    if (!currentChatId) return;
    updateChat(currentChatId, { status });
    toast({
      title: "Estado actualizado",
      description: `El chat se ha marcado como ${status === 'solved' ? 'solucionado' : 'persistente'}.`,
    });
  };

  const startNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      title: "Nuevo Chat",
      messages: initialMessages,
      status: null,
      relatedMachinery: "Motor, cojinetes"
    };
    setChats(prev => [...prev, newChat]);
    setCurrentChatId(newChatId);
  };

  const handleEditTitle = () => {
    if (currentChat && newTitle.trim()) {
      updateChat(currentChat.id, { title: newTitle.trim() });
      setIsEditTitleModalOpen(false);
      setNewTitle("");
      toast({ title: "Título actualizado correctamente." });
    }
  };

  const handleEditMachinery = () => {
    if (currentChat && newMachinery.trim()) {
        updateChat(currentChat.id, { relatedMachinery: newMachinery.trim() });
        setIsEditMachineryModalOpen(false);
        setNewMachinery("");
        toast({ title: "Maquinaria actualizada correctamente." });
    }
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
  }, [currentChat?.messages]);

  return (
    <>
      <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-10rem)]">
        <div className="lg:col-span-3 lg:block hidden">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Acciones del Chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => updateChatStatus('solved')} className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={!currentChatId}>
                <CheckCircle className="mr-2 h-4 w-4" /> Marcar como solucionado
              </Button>
              <Button onClick={() => updateChatStatus('persistent')} variant="destructive" className="w-full" disabled={!currentChatId}>
                <AlertTriangle className="mr-2 h-4 w-4" /> Marcar como persistente
              </Button>
              <Separator className="my-6" />
              <h3 className="font-semibold text-base">Chats Guardados</h3>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {chats.map(chat => (
                    <div key={chat.id} 
                         className={cn("flex items-center text-sm p-2 rounded-md cursor-pointer", currentChatId === chat.id ? "bg-secondary" : "hover:bg-secondary/80")}
                         onClick={() => setCurrentChatId(chat.id)}
                    >
                      {chat.status === 'solved' && <Circle className="mr-2 h-3 w-3 text-green-500 fill-green-500" />}
                      {chat.status === 'persistent' && <Circle className="mr-2 h-3 w-3 text-red-500 fill-red-500" />}
                      {!chat.status && <Circle className="mr-2 h-3 w-3 text-muted-foreground fill-muted-foreground" />}
                      <span className="flex-1 truncate">{chat.title}</span>
                    </div>
                  ))}
                  {chats.length === 0 && (
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
              <div className="flex items-center justify-center">
                <CardTitle className="font-headline text-center text-2xl">{currentChat?.title || "Mecan IA"}</CardTitle>
                <Button variant="ghost" size="icon" className="ml-2" onClick={() => { setIsEditTitleModalOpen(true); setNewTitle(currentChat?.title || ""); }} disabled={!currentChatId}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="space-y-6 p-4">
                  {currentChat?.messages.map((message, index) => (
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
                  disabled={isLoading || !currentChatId}
                />
                <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1">
                  <Button variant="ghost" size="icon" disabled={isLoading || !currentChatId}>
                      <Plus className="h-5 w-5" />
                  </Button>
                  <Button onClick={handleSend} size="icon" disabled={isLoading || !currentChatId}>
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
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm mb-2">Maquinaria Relacionada</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setIsEditMachineryModalOpen(true); setNewMachinery(currentChat?.relatedMachinery || ""); }} disabled={!currentChatId}>
                    <Edit className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{currentChat?.relatedMachinery || "No seleccionada"}</p>
            </CardContent>
            <div className="p-4 mt-auto border-t">
                <Button onClick={startNewChat} variant="secondary" className="w-full">
                    <MessageSquarePlus className="mr-2 h-4 w-4" /> Nuevo Chat
                </Button>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={isEditTitleModalOpen} onOpenChange={setIsEditTitleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Título del Chat</DialogTitle>
            <DialogDescription>
              Ingresa un nuevo título para esta conversación.
            </DialogDescription>
          </DialogHeader>
          <Input 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nuevo título"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleEditTitle}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditMachineryModalOpen} onOpenChange={setIsEditMachineryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Maquinaria Relacionada</DialogTitle>
            <DialogDescription>
              Modifica la maquinaria asociada a este diagnóstico.
            </DialogDescription>
          </DialogHeader>
          <Input 
            value={newMachinery}
            onChange={(e) => setNewMachinery(e.target.value)}
            placeholder="Ej: Motor, cojinetes"
          />
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleEditMachinery}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
