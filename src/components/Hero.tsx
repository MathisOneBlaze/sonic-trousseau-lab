import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import heroImage from "@/assets/hero-studio.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(11, 11, 11, 0) 0%, rgba(11, 11, 11, 0.3) 100%), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="container relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="mb-6 text-white drop-shadow-lg">
            Atelier Création & Production Musicale
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            Par Mathis OneBlaze — Un programme d'initiation artistique et technique pour révéler le potentiel créatif des jeunes (12–18 ans).
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-600/90 text-white transition-all hover:scale-105"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Réserver une session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-foreground transition-all hover:scale-105"
            >
              Télécharger la brochure (PDF)
              <Download className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <p className="text-sm md:text-base text-white/90">
            Groupes 5–10 jeunes • Formules: 2h / cycle complet • Studio partenaire inclus
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
