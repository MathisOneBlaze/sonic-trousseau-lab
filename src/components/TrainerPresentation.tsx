import mathisPortrait from "@/assets/mathis-portrait-new.jpg";

const TrainerPresentation = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src={mathisPortrait} 
                alt="Mathis OneBlaze — formateur en studio (Le Trousseau)"
                className="rounded-lg shadow-xl w-full h-auto"
                loading="lazy"
              />
            </div>
            
            <div>
              <h2 className="mb-6">Mathis OneBlaze — Formateur & Producteur</h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground/80 leading-relaxed">
                  Mathis Moncoq, fondateur du Trousseau, est formateur artistique et technicien du son diplômé (BTS Audiovisuel / formation INA). Artiste et ingénieur studio, il cumule années de production, accompagnement d'artistes et animation d'ateliers jeunesse en Île-de-France. Sa pédagogie combine exigence technique et mise en confiance — l'objectif : donner aux jeunes les outils concrets (écriture, composition, enregistrement, diffusion) pour porter leurs projets de l'idée à la diffusion.
                </p>
              </div>
              
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground min-w-[140px]">Mixage</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: '90%' }} />
                  </div>
                  <span className="text-sm font-semibold text-primary min-w-[40px] text-right">90%</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground min-w-[140px]">Production</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: '85%' }} />
                  </div>
                  <span className="text-sm font-semibold text-primary min-w-[40px] text-right">85%</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground min-w-[140px]">Pédagogie</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: '88%' }} />
                  </div>
                  <span className="text-sm font-semibold text-primary min-w-[40px] text-right">88%</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground min-w-[140px]">Direction artistique</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: '86%' }} />
                  </div>
                  <span className="text-sm font-semibold text-primary min-w-[40px] text-right">86%</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground min-w-[140px]">Post-prod vidéo</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: '70%' }} />
                  </div>
                  <span className="text-sm font-semibold text-primary min-w-[40px] text-right">70%</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground min-w-[140px]">Gestion de projet</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: '80%' }} />
                  </div>
                  <span className="text-sm font-semibold text-primary min-w-[40px] text-right">80%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainerPresentation;
