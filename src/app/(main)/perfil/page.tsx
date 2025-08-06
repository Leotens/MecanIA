import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const userProfile = {
  name: "Carlos Ramírez",
  email: "carlos.ramirez@industrias.com",
  role: "Técnico de mantenimiento",
  avatarUrl: "https://placehold.co/128x128.png",
  solvedProblems: 42,
  lastActivity: "2024-07-22",
};

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex flex-col items-center space-y-4 pt-8">
        <Avatar className="h-32 w-32 border-4 border-primary">
          <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} data-ai-hint="person face" />
          <AvatarFallback>CR</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h1 className="text-3xl font-bold font-headline">{userProfile.name}</h1>
          <p className="text-muted-foreground">{userProfile.email}</p>
          <p className="font-semibold text-primary">{userProfile.role}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Intervenciones</CardTitle>
          <CardDescription>Un resumen de tu actividad en la plataforma.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-around text-center p-4 bg-secondary/50 rounded-lg">
            <div>
              <p className="text-4xl font-bold text-primary">{userProfile.solvedProblems}</p>
              <p className="text-sm text-muted-foreground">Problemas Resueltos</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{userProfile.lastActivity}</p>
              <p className="text-sm text-muted-foreground">Última Actividad</p>
            </div>
          </div>
          <div className="text-center pt-4">
            <Button>Ver historial completo</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
