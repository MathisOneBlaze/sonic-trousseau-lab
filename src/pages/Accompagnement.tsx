import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Calendar as CalendarIcon, Users, Music, UserRound, Check, Sparkles, Video, Calendar } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const Accompagnement = () => {
  // Schedule (from Programme)
  const weeks = [
    { number: 1, title: "Session Découverte", objective: "Rencontre des membres, échanges, partage des travaux", format: "Discussions collectives, Q&A avec Mathis OneBlaze, animation de la communauté", icon: Users },
    { number: 2, title: "Session en Studio", objective: "Ateliers pratiques, exercices d'écriture et composition", format: "Travail collectif sur projets communs", icon: Music },
    { number: 3, title: "Session libre / pratique individuelle", objective: "Temps de mise en pratique, préparation personnelle", format: "Pratique autonome", icon: CalendarIcon },
    { number: 4, title: "Coaching Individuel", objective: "Suivi personnalisé sur les projets de l'artiste", format: "Horaires : 16h à 20h chaque jour de la dernière semaine du mois", icon: UserRound },
  ];

  const upcomingSessions = [
    { title: "Session Découverte", date: "2 Décembre 2025", time: "18h00 - 20h00", location: "Studio EVRGRN / En ligne", description: "Rencontre des membres, échanges et partage des travaux" },
    { title: "Session en Studio", date: "9 Décembre 2025", time: "14h00 - 18h00", location: "Studio EVRGRN", description: "Ateliers pratiques, exercices d'écriture et composition" },
    { title: "Session libre", date: "16 Décembre 2025", time: "Flexible", location: "Pratique individuelle", description: "Temps de mise en pratique, préparation personnelle" },
    { title: "Coaching Individuel", date: "23-27 Décembre 2025", time: "16h00 - 20h00", location: "Studio EVRGRN", description: "Suivi personnalisé sur tes projets" },
  ];

  const highlightDates = [
    new Date(2025, 11, 2),
    new Date(2025, 11, 9),
    new Date(2025, 11, 16),
    new Date(2025, 11, 23),
    new Date(2025, 11, 24),
    new Date(2025, 11, 25),
    new Date(2025, 11, 26),
    new Date(2025, 11, 27),
  ];

  // Pricing tiers (from Abonnements)
  const tiers = [
    {
      id: 0,
      name: "To to to",
      price: "Gratuit",
      description: "Découvre Le Trousseau et accède aux vidéos gratuites",
      features: [
        "Newsletter + accès aux vidéos gratuites",
        "Accès à la communauté (WhatsApp ou Discord)",
        "Notifications sorties et événements",
      ],
      cta: "Rejoindre gratuitement",
      variant: "outline" as const,
      link: "#",
    },
    {
      id: 1,
      name: "Passe-partout",
      price: "12 €/mois",
      priceAnnual: "ou 120 €/an",
      description: "Accède au corpus complet et participe aux sessions collectives",
      features: [
        "Accès au corpus complet (vidéos non coupées + replays)",
        "1 session collective par mois (échanges & votes sur les thèmes)",
        "Réductions sur événements partenaires",
      ],
      cta: "Je passe au niveau 1",
      variant: "secondary" as const,
      link: "/accompagnement#tarifs",
    },
    {
      id: 2,
      name: "Sésame",
      price: "45 €/mois",
      priceAnnual: "ou 450 €/an",
      description: "Le parcours complet avec accompagnement personnalisé",
      features: [
        "Tout le niveau 1",
        "3 modules mensuels : studio, masterclass invité·e·s, session individuelle avec Mathis OneBlaze",
        "Priorité et réductions sur résidences SPARK et événements",
      ],
      cta: "Je veux le parcours complet",
      variant: "default" as const,
      link: "/accompagnement#tarifs",
      highlighted: true,
    },
  ];

  const monthlySchedule = [
    { week: "Semaine 1", title: "Rencontre et échanges", description: "Session collective pour se retrouver, échanger et voter sur les thèmes du mois", icon: Users },
    { week: "Semaine 2", title: "Studio", description: "Création et mise en pratique : on produit, on enregistre, on expérimente", icon: Sparkles },
    { week: "Semaine 3", title: "Masterclass invités", description: "Des professionnel·le·s viennent partager leur expérience et leurs techniques", icon: Video },
    { week: "Semaine 4", title: "Session individuelle", description: "Rendez-vous personnalisé avec Mathis OneBlaze pour un accompagnement sur mesure", icon: Calendar },
  ];

  const faqItems = [
    { question: "Puis-je changer de niveau ?", answer: "Oui, tu peux passer d'un niveau à un autre à tout moment. Les changements prennent effet dès le mois suivant." },
    { question: "Comment se déroulent les sessions ?", answer: "Les sessions collectives se font en visioconférence ou en présentiel selon le programme. Les sessions individuelles sont planifiées directement avec Mathis OneBlaze selon tes disponibilités." },
    { question: "Y a-t-il un engagement ?", answer: "Non, les abonnements sont sans engagement. Tu peux annuler ou mettre en pause ton abonnement à tout moment." },
    { question: "Puis-je participer depuis l'étranger ?", answer: "Oui ! Les sessions en ligne te permettent de participer de n'importe où dans le monde. Seuls certains événements physiques sont limités à l'Île-de-France." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Accompagnement — Le Trousseau</title>
        <meta name="description" content="L'accompagnement Le Trousseau : calendrier, formules et FAQ. Un parcours structuré avec sessions collectives, studio et coaching individuel." />
      </Helmet>

      <Navigation />

      {/* Hero */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Accompagnement Le Trousseau</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Un accompagnement mensuel structuré pour progresser rapidement, créer avec confiance et développer ta pratique artistique.
          </p>
        </div>
      </section>

      {/* Structure mensuelle (ex-Programme) */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-6">Comment ça marche ?</h2>
          <p className="text-lg text-muted-foreground mb-6">Chaque mois suit un rythme clair et exigeant : découverte, studio, pratique autonome et coaching individuel. Ce cadre te permet de progresser régulièrement et de finaliser tes projets.</p>
          <div className="grid md:grid-cols-1 gap-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Le rythme mensuel</CardTitle>
                <CardDescription>4 semaines, 4 temps forts</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  {weeks.map((w, i) => {
                    const Icon = w.icon as any;
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Semaine {w.number} — {w.title}</p>
                          <p className="text-muted-foreground">{w.objective}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Tarifs */}
      <section id="tarifs" className="py-20 bg-secondary">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier) => (
              <Card key={tier.id} className={tier.highlighted ? "border-red-600 shadow-lg relative" : ""}>
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Recommandé
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">Niveau {tier.id} — {tier.name}</CardTitle>
                  <CardDescription className="text-lg mt-2">
                    <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                    {tier.priceAnnual && (
                      <span className="block text-sm mt-1">{tier.priceAnnual}</span>
                    )}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mt-4">{tier.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant={tier.variant} className="w-full" size="lg" asChild>
                    <a href={tier.link}>{tier.cta}</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sessions à venir */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Sessions à venir</CardTitle>
                <CardDescription>Décembre 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((s, idx) => (
                    <div key={idx} className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold">{s.title}</h3>
                        <span className="text-xs text-muted-foreground">{s.time}</span>
                      </div>
                      <p className="text-sm font-medium text-emerald mb-1">{s.date}</p>
                      <p className="text-sm text-muted-foreground mb-1">{s.location}</p>
                      <p className="text-sm">{s.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Calendrier</CardTitle>
                <CardDescription>Dates des prochaines sessions</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <CalendarComponent
                  mode="multiple"
                  selected={highlightDates}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container px-4 max-w-3xl">
          <h2 className="text-center mb-12 text-3xl font-bold">Questions fréquentes</h2>
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="border rounded-lg p-5">
                <p className="font-semibold mb-2">{item.question}</p>
                <p className="text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à rejoindre la communauté ?</h2>
          <p className="text-lg text-muted-foreground mb-8">Choisis le niveau qui te correspond et commence ton parcours dès aujourd'hui.</p>
          <a href="#tarifs">
            <Button size="lg" className="text-lg px-8 py-6">Choisir mon niveau</Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Accompagnement;
