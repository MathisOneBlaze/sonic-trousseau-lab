import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Music, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";

const Programme = () => {
  const weeks = [
    {
      number: 1,
      title: "Session Découverte",
      objective: "Rencontre des membres, échanges, partage des travaux",
      format: "Discussions collectives, Q&A avec Mathis OneBlaze, animation de la communauté",
      icon: Users,
    },
    {
      number: 2,
      title: "Session en Studio",
      objective: "Ateliers pratiques, exercices d'écriture et composition",
      format: "Travail collectif sur projets communs",
      icon: Music,
    },
    {
      number: 3,
      title: "Session libre / pratique individuelle",
      objective: "Temps de mise en pratique, préparation personnelle",
      format: "Pratique autonome",
      icon: Calendar,
    },
    {
      number: 4,
      title: "Coaching Individuel",
      objective: "Suivi personnalisé sur les projets de l'artiste",
      format: "Horaires : 16h à 20h chaque jour de la dernière semaine du mois",
      icon: UserRound,
    },
  ];

  const [date, setDate] = useState<Date | undefined>(new Date());

  const upcomingSessions = [
    {
      title: "Session Découverte",
      date: "2 Décembre 2025",
      time: "18h00 - 20h00",
      location: "Studio EVRGRN / En ligne",
      description: "Rencontre des membres, échanges et partage des travaux"
    },
    {
      title: "Session en Studio",
      date: "9 Décembre 2025",
      time: "14h00 - 18h00",
      location: "Studio EVRGRN",
      description: "Ateliers pratiques, exercices d'écriture et composition"
    },
    {
      title: "Session libre",
      date: "16 Décembre 2025",
      time: "Flexible",
      location: "Pratique individuelle",
      description: "Temps de mise en pratique, préparation personnelle"
    },
    {
      title: "Coaching Individuel",
      date: "23-27 Décembre 2025",
      time: "16h00 - 20h00",
      location: "Studio EVRGRN",
      description: "Suivi personnalisé sur tes projets"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/artistes" className="text-sm hover:underline">
            ← Retour aux artistes
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Programme Le Trousseau
          </h1>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-6">
            Qu'est-ce que le Programme Le Trousseau ?
          </h2>
          <p className="text-lg mb-8 leading-relaxed">
            Le programme Le Trousseau est un accompagnement mensuel pensé pour les artistes qui souhaitent progresser rapidement, créer avec confiance et développer leur pratique musicale. Chaque mois est structuré en 4 semaines avec des activités collectives et individuelles.
          </p>

          {/* Tarification */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Formule Mensuelle</CardTitle>
                <CardDescription>Accès complet au programme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-4">45 €<span className="text-lg font-normal text-muted-foreground">/mois</span></div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Session Découverte hebdomadaire</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Session en Studio collective</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Accès aux ressources pédagogiques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>1 session de Coaching Individuel (dernière semaine)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-xl">Cycle Complet (3 mois)</CardTitle>
                <CardDescription>Engagement sur un trimestre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-4">120 €<span className="text-lg font-normal text-muted-foreground">/3 mois</span></div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Tout le contenu de la formule mensuelle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Économie de 15 € sur 3 mois</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Suivi personnalisé renforcé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Priorité pour les sessions studio</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <p className="text-lg leading-relaxed">
            L'accès au programme se fait via un abonnement mensuel. Chaque semaine, tu bénéficies d'une expérience unique pour progresser à ton rythme et en communauté.
          </p>
        </div>
      </section>

      {/* Calendrier */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-4">Calendrier des sessions</h2>
          <p className="text-lg mb-8">
            Consulte ici toutes les sessions prévues ce mois et organise ta participation selon tes disponibilités.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Calendrier</CardTitle>
                <CardDescription>
                  Sélectionne une date pour voir les sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Sessions list */}
            <Card>
              <CardHeader>
                <CardTitle>Sessions à venir</CardTitle>
                <CardDescription>
                  Décembre 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold">{session.title}</h3>
                        <span className="text-xs text-muted-foreground">{session.time}</span>
                      </div>
                      <p className="text-sm font-medium text-emerald mb-1">
                        {session.date}
                      </p>
                      <p className="text-sm text-muted-foreground mb-1">
                        {session.location}
                      </p>
                      <p className="text-sm">
                        {session.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à rejoindre la communauté ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Rejoins le programme et bénéficie d'un accompagnement mensuel pour développer ta pratique artistique
          </p>
          <Link to="/abonnements">
            <Button size="lg" className="text-lg px-8 py-6">
              Je rejoins le programme
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Programme;