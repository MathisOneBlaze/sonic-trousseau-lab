import { Music, Mic, FileText, Video, TrendingUp, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Results = () => {
  const deliverables = [
    {
      icon: Music,
      title: "1 maquette audio par groupe (si cycle)"
    },
    {
      icon: Mic,
      title: "1 titre enregistré en studio (selon format)"
    },
    {
      icon: FileText,
      title: "1 plan de sortie (optionnel)"
    },
    {
      icon: Video,
      title: "1 clip vidéo (optionnel)"
    }
  ];

  const impacts = [
    {
      icon: TrendingUp,
      title: "Développement de la créativité"
    },
    {
      icon: Heart,
      title: "Hausse de la confiance, ambition"
    },
    {
      icon: Heart,
      title: "Aisance sociale"
    },
    {
      icon: TrendingUp,
      title: "80% de satisfaction attendue"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-4 text-center">Résultats attendus (KPIs)</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Des livrables concrets et des impacts mesurables sur le développement personnel des jeunes
          </p>
          
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-center">Livrables</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {deliverables.map((item, index) => (
                <Card key={index} className="border-2 hover:border-primary transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                    <p className="font-semibold">{item.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-center">Impacts</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {impacts.map((item, index) => (
                <Card key={index} className="border-2 hover:border-primary transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                    <p className="font-semibold">{item.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Results;
