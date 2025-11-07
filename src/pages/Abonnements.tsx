import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Calendar, Users, Video, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Abonnements = () => {
  const tiers = [
    {
      id: 0,
      name: "To to to",
      price: "Gratuit",
      description: "Découvre Le Trousseau et accède aux vidéos gratuites",
      features: [
        "Newsletter + accès aux vidéos gratuites",
        "Accès à la communauté (WhatsApp ou Discord)",
        "Notifications sorties et événements"
      ],
      cta: "Rejoindre gratuitement",
      variant: "outline" as const,
      link: "#"
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
        "Réductions sur événements partenaires"
      ],
      cta: "Je passe au niveau 1",
      variant: "secondary" as const,
      link: "/payment-niveau1"
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
        "Priorité et réductions sur résidences SPARK et événements"
      ],
      cta: "Je veux le parcours complet",
      variant: "default" as const,
      link: "/payment-niveau2",
      highlighted: true
    }
  ];

  const monthlySchedule = [
    {
      week: "Semaine 1",
      title: "Rencontre et échanges",
      description: "Session collective pour se retrouver, échanger et voter sur les thèmes du mois",
      icon: Users
    },
    {
      week: "Semaine 2",
      title: "Studio",
      description: "Création et mise en pratique : on produit, on enregistre, on expérimente",
      icon: Sparkles
    },
    {
      week: "Semaine 3",
      title: "Masterclass invités",
      description: "Des professionnel·le·s viennent partager leur expérience et leurs techniques",
      icon: Video
    },
    {
      week: "Semaine 4",
      title: "Session individuelle",
      description: "Rendez-vous personnalisé avec Mathis OneBlaze pour un accompagnement sur mesure",
      icon: Calendar
    }
  ];

  const faqItems = [
    {
      question: "Puis-je changer de niveau ?",
      answer: "Oui, tu peux passer d'un niveau à un autre à tout moment. Les changements prennent effet dès le mois suivant."
    },
    {
      question: "Comment se déroulent les sessions ?",
      answer: "Les sessions collectives se font en visioconférence ou en présentiel selon le programme. Les sessions individuelles sont planifiées directement avec Mathis OneBlaze selon tes disponibilités."
    },
    {
      question: "Y a-t-il un engagement ?",
      answer: "Non, les abonnements sont sans engagement. Tu peux annuler ou mettre en pause ton abonnement à tout moment."
    },
    {
      question: "Puis-je participer depuis l'étranger ?",
      answer: "Oui ! Les sessions en ligne te permettent de participer de n'importe où dans le monde. Seuls certains événements physiques sont limités à l'Île-de-France."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Abonnements — Le Trousseau</title>
        <meta
          name="description"
          content="Rejoins Le Trousseau avec l'un de nos trois niveaux d'abonnement. Accède aux vidéos, participe aux ateliers et bénéficie d'un accompagnement personnalisé."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
            <div className="container px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="mb-6">Rejoindre Le Trousseau</h1>
                <p className="text-xl text-foreground/80 mb-8">
                  Trois niveaux d'abonnement pour évoluer à ton rythme, accéder aux vidéos, participer aux activités et rejoindre la communauté.
                </p>
              </div>
            </div>
          </section>

          {/* Introduction */}
          <section className="py-12 bg-secondary">
            <div className="container px-4">
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-lg text-foreground/80 leading-relaxed">
                  Les vidéos gratuites t'ouvrent les portes du Trousseau. Les abonnements te permettent d'aller plus loin : apprendre, pratiquer, rencontrer et créer.
                </p>
              </div>
            </div>
          </section>

          {/* Pricing Tiers */}
          <section className="py-20">
            <div className="container px-4">
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {tiers.map((tier) => (
                  <Card 
                    key={tier.id} 
                    className={tier.highlighted ? "border-primary shadow-lg relative" : ""}
                  >
                    {tier.highlighted && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
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
                      <Button 
                        variant={tier.variant} 
                        className="w-full" 
                        size="lg"
                        asChild
                      >
                        <a href={tier.link}>{tier.cta}</a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="py-20 bg-secondary">
            <div className="container px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-center mb-12">Comment ça marche</h2>
                <p className="text-center text-lg text-muted-foreground mb-12">
                  Le déroulement mensuel pour les abonnés Sésame (niveau 2)
                </p>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  {monthlySchedule.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">{item.week}</p>
                              <CardTitle className="text-lg">{item.title}</CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20">
            <div className="container px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-center mb-12">Questions fréquentes</h2>
                
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 bg-primary text-primary-foreground">
            <div className="container px-4">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="mb-6 text-primary-foreground">
                  Découvre le niveau qui te correspond et commence ton parcours dès aujourd'hui
                </h2>
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Choisir mon niveau
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Abonnements;
