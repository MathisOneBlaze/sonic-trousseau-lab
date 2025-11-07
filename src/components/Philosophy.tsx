import { Lightbulb, Users, Target, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import atelier1761 from "@/assets/atelier-1761.png";

const Philosophy = () => {
  const pillars = [
    {
      icon: Lightbulb,
      title: "Transmission",
      description: "Transmettre savoirs et techniques (studio, MAO, scénographie)."
    },
    {
      icon: Target,
      title: "Autonomie",
      description: "Donner des méthodes pour produire seul et en équipe."
    },
    {
      icon: Users,
      title: "Collectif",
      description: "Travailler le projet comme un collectif professionnel."
    },
    {
      icon: Briefcase,
      title: "Professionnalisation",
      description: "Structurer un parcours, comprendre les métiers et préparer l'insertion professionnelle."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h2 className="mb-4">Philosophie & objectifs</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Apprendre à créer, comprendre les métiers, fédérer les talents et révéler les vocations.
              </p>
              
              <div className="space-y-6">
                {pillars.map((pillar, index) => (
                  <Card key={index} className="border-2 hover:border-primary transition-all hover:shadow-lg">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                          <pillar.icon className="w-7 h-7 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold">{pillar.title}</h3>
                        <p className="text-muted-foreground">{pillar.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img
                src={atelier1761}
                alt="Session d'atelier Le Trousseau - participants en activité"
                className="rounded-lg shadow-xl w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
