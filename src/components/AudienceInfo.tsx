import { Users, MapPin, User } from "lucide-react";
import atelier1747 from "@/assets/atelier-1747.png";

const AudienceInfo = () => {
  const details = [
    {
      icon: Users,
      label: "Public",
      value: "Jeunes 12–18 ans (collège / lycée)"
    },
    {
      icon: Users,
      label: "Effectif",
      value: "5–10 participants"
    },
    {
      icon: User,
      label: "Niveau",
      value: "Débutant → intermédiaire"
    },
    {
      icon: MapPin,
      label: "Lieu",
      value: "Salle polyvalente + studio partenaire + lieu de tournage clip (optionnel)"
    },
    {
      icon: User,
      label: "Encadrement",
      value: "1 formateur principal (Mathis) + 1 assistant technique (si budget)"
    }
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-12 text-center">Public, encadrement & logistique</h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="grid sm:grid-cols-2 gap-6">
              {details.map((detail, index) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-background rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <detail.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">{detail.label}</h3>
                    <p className="text-foreground">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="relative">
              <img
                src={atelier1747}
                alt="Jeune participant en pleine écriture lors d'un atelier Le Trousseau"
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

export default AudienceInfo;
