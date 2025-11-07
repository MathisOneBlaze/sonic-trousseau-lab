import { Speaker, Projector, Printer, Smartphone, Wifi, Mic } from "lucide-react";

const TechnicalResources = () => {
  const resources = [
    {
      icon: Speaker,
      name: "Sono",
      description: "1 enceinte ou plus"
    },
    {
      icon: Projector,
      name: "Vidéoprojecteur",
      description: "Pour présentations"
    },
    {
      icon: Printer,
      name: "Paperboard",
      description: "Pour brainstorming"
    },
    {
      icon: Printer,
      name: "Imprimante",
      description: "Avec consommables"
    },
    {
      icon: Printer,
      name: "Fournitures",
      description: "Stylos, feuilles"
    },
    {
      icon: Smartphone,
      name: "Prises mobiles",
      description: "Smartphone/tablette"
    },
    {
      icon: Wifi,
      name: "Internet",
      description: "Connexion stable"
    },
    {
      icon: Mic,
      name: "Studio partenaire",
      description: "Console, micros, DAW"
    }
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-12 text-center">Moyens techniques</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-6 bg-background rounded-lg hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <resource.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{resource.name}</h3>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 max-w-3xl mx-auto space-y-4">
            <p className="text-center text-muted-foreground">
              Le client fournit la liste du matériel disponible sur site (sono, vidéoprojecteur, paperboard, imprimante, etc.).
            </p>
            <p className="text-center text-muted-foreground">
              Le Trousseau peut louer le matériel indispensable manquant selon le forfait choisi (en sus, précisé au devis).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalResources;
