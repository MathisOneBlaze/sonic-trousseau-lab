import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import atelier3344 from "@/assets/atelier-3344.jpg";

const ModulesTable = () => {
  const modules = [
    {
      number: "1",
      title: "Découverte & Inspiration",
      objective: "Comprendre les métiers et rôles",
      result: "Vision d'ensemble du secteur"
    },
    {
      number: "2",
      title: "Écriture & Thématique",
      objective: "Trouver un propos collectif",
      result: "Texte commun, refrain fort"
    },
    {
      number: "3",
      title: "Composition & Production",
      objective: "Créer un morceau original",
      result: "Maquette du titre"
    },
    {
      number: "4",
      title: "Interprétation & Enregistrement",
      objective: "Apprendre à performer et enregistrer",
      result: "Titre enregistré en studio"
    },
    {
      number: "5",
      title: "Droit & Monétisation",
      objective: "Comprendre la valeur de la création",
      result: "Connaissance SACEM / droits d'auteur"
    },
    {
      number: "6",
      title: "Promotion & Diffusion",
      objective: "Apprendre à présenter son œuvre",
      result: "Plan de sortie / communication"
    },
    {
      number: "+",
      title: "Optionnel — Tournage clip",
      objective: "Mise en image du projet",
      result: "Clip collectif prêt à diffuser"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-12 text-center">Modules</h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
            <div className="relative order-2 lg:order-1">
              <img
                src={atelier3344}
                alt="Session de production musicale lors d'un atelier Le Trousseau"
                className="rounded-lg shadow-xl w-full h-auto"
                loading="lazy"
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary">
                      <TableHead className="font-bold">Module</TableHead>
                      <TableHead className="font-bold">Objectif</TableHead>
                      <TableHead className="font-bold">Résultat attendu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modules.map((module, index) => (
                      <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <span className="text-primary font-bold mr-2">{module.number}</span>
                          {module.title}
                        </TableCell>
                        <TableCell>{module.objective}</TableCell>
                        <TableCell>{module.result}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Demander devis pour parcours complet
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModulesTable;
