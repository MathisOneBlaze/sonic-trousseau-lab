import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Pricing = () => {
  const mainPricing = [
    {
      formula: "À la carte (2h)",
      price: "250 € TTC",
      description: "Groupe 5–10 participant·es"
    },
    {
      formula: "Cycle Complet (6 × 4h + 2 jours studio/clip)",
      price: "2 100 € TTC",
      description: "Groupe 5–10 participant·es"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-4 text-center">Tarification</h2>
          <p className="text-center text-muted-foreground mb-12">
            Tarification par groupe (5–10 participant·es). Le prix final est adapté au contexte de chaque devis (lieu, équipement disponible, options studio/clip, déplacements).
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {mainPricing.map((item, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-all">
                <CardHeader>
                  <CardTitle className="text-xl">{item.formula}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary mb-2">{item.price}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Obtenir un devis personnalisé
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
