import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Quel matériel fournissez-vous ?",
      answer: "Nous fournissons sono, vidéoprojecteur, paperboard, imprimante avec consommables, fournitures (stylos, feuilles). Le matériel de studio professionnel (console, micros, DAW) et l'équipement de tournage clip sont disponibles en option selon la formule choisie."
    },
    {
      question: "Combien d'élèves par groupe ?",
      answer: "Nous accueillons entre 5 et 10 participants par atelier. Cette taille de groupe permet un accompagnement personnalisé tout en favorisant la dynamique collective."
    },
    {
      question: "Et si un jeune manque une séance ?",
      answer: "Un rattrapage est possible selon disponibilité. Tous les supports pédagogiques sont partagés avec les participants pour permettre de suivre même en cas d'absence ponctuelle. Exception: la session studio et le tournage du clip ne sont pas rattrapables. Des alternatives de valorisation peuvent être proposées au cas par cas."
    },
    {
      question: "Comment sont gérés les droits d'auteur et le droit à l'image ?",
      answer: "Un premier droit à l'image est recueilli pour tous les participants, permettant de documenter les ateliers et le travail pédagogique. Si tournage de clip ou séance studio: autorisation parentale spécifique requise (formulaires fournis). Si sortie d'un titre (commerciale ou non): contrats en bonne et due forme et autorisation parentale requis (répartition des droits clarifiée au devis/contrat)."
    },
    {
      question: "L'atelier est-il adapté aux débutants complets ?",
      answer: "Absolument ! Notre pédagogie est conçue pour accueillir des jeunes de 12 à 18 ans, du niveau débutant au niveau intermédiaire. Aucune connaissance musicale préalable n'est requise."
    },
    {
      question: "Quels sont les prérequis techniques pour accueillir l'atelier ?",
      answer: "Il faut prévoir une salle polyvalente avec connexion internet stable, des tables et chaises pour le groupe, et une prise électrique. Pour les sessions studio et tournage, nous travaillons avec des partenaires équipés."
    }
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-12 text-center">Questions fréquentes</h2>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background border-2 rounded-lg px-6 data-[state=open]:border-primary"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
