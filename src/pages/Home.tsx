import { Link } from "react-router-dom";
import { GraduationCap, Sprout, Users, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import keyLogo from "@/assets/key-logo.png";
import mathisPortrait from "@/assets/mathis-portrait-new.jpg";
import atelier1747 from "@/assets/atelier-1747.png";
import atelier1761 from "@/assets/atelier-1761.png";
import atelier3344 from "@/assets/atelier-3344.jpg";

const Home = () => {
  const timelineEvents = [
    { year: "2025", event: "Création de la chaîne YouTube 'Le Trousseau'" },
    { year: "2023", event: "Atelier avec l'association Main d'Œuvre" },
    { year: "2019", event: "Atelier à Créteil" },
  ];

  return (
    <>
      <Helmet>
        <title>Le Trousseau — Transmission, Création, Autonomie</title>
        <meta
          name="description"
          content="Un écosystème artistique et pédagogique pour révéler le potentiel créatif des jeunes à travers l'art, la technique et l'intelligence collective."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-20 bg-gradient-to-b from-background to-secondary/20">
            <div className="container px-4 text-center">
              <div className="mb-8 flex justify-center">
                <img 
                  src={keyLogo} 
                  alt="Logo Le Trousseau - Clé dorée avec symbole infini" 
                  className="w-48 h-48 object-contain"
                />
              </div>
              
              <h1 className="mb-6">Le Trousseau — Transmission, Création, Autonomie</h1>
              
              <p className="text-xl text-foreground/80 max-w-3xl mx-auto mb-10 leading-relaxed">
                Un écosystème artistique et pédagogique pour révéler le potentiel créatif des jeunes à travers l'art, la technique et l'intelligence collective.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/diagnostic">Je suis un artiste</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link to="/atelier">Je suis une association</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/documentation">Ressources & Corpus</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Présentation du Trousseau */}
          <section className="py-20">
            <div className="container px-4">
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-lg text-foreground/80 leading-relaxed mb-12">
                  Le Trousseau est une initiative d'éducation artistique et citoyenne fondée par Mathis OneBlaze. Sa mission : transmettre les savoirs liés à la création, la production et la diffusion artistique, tout en accompagnant les jeunes vers l'autonomie, la confiance et l'expression de soi.
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-2">Transmission du savoir</h3>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sprout className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-2">Autonomie créative</h3>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-2">Esprit collectif</h3>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Le Fondateur */}
          <section className="py-20 bg-secondary">
            <div className="container px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="relative">
                    <img
                      src={mathisPortrait}
                      alt="Mathis OneBlaze — fondateur du Trousseau"
                      className="rounded-lg shadow-xl w-full h-auto"
                      loading="lazy"
                    />
                  </div>

                  <div>
                    <h2 className="mb-6">Le Fondateur</h2>
                    <p className="text-foreground/80 leading-relaxed mb-6">
                      Artiste, formateur et producteur, Mathis OneBlaze a fondé Le Trousseau pour relier la création artistique et la pédagogie. Diplômé de l'INA, il a accompagné de nombreux artistes dans leurs parcours studio et scéniques. Aujourd'hui, il met son expérience au service des jeunes talents pour leur transmettre les clés de la création et de l'autonomie.
                    </p>
                    <Button variant="outline">Découvrir son parcours</Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="py-20">
            <div className="container px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-center mb-12">Notre Parcours</h2>
                
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/30" />
                  
                  <div className="space-y-8">
                    {timelineEvents.map((item, index) => (
                      <div key={index} className="relative pl-20">
                        <div className="absolute left-5 w-6 h-6 bg-primary rounded-full border-4 border-background" />
                        <div className="bg-card rounded-lg p-6 shadow-sm">
                          <span className="font-heading font-bold text-primary text-xl">
                            {item.year}
                          </span>
                          <p className="text-foreground/80 mt-2">{item.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2 text-primary">
                      <ArrowUp className="w-5 h-5" />
                      <span className="text-sm font-semibold">Progression</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* L'Atelier Preview */}
          <section className="py-20 bg-secondary">
            <div className="container px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="mb-12 text-center">L'Atelier Création & Production Musicale</h2>
                
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <img 
                    src={atelier1747} 
                    alt="Jeune participant écrivant lors d'un atelier Le Trousseau"
                    className="rounded-lg shadow-lg w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <img 
                    src={atelier1761} 
                    alt="Tableau d'activités lors d'un atelier Le Trousseau"
                    className="rounded-lg shadow-lg w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <img 
                    src={atelier3344} 
                    alt="Session d'atelier en cours avec formateur et participants"
                    className="rounded-lg shadow-lg w-full h-64 object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="text-center">
                  <p className="text-lg text-foreground/80 leading-relaxed mb-8 max-w-3xl mx-auto">
                    Un atelier complet qui initie les jeunes aux métiers de la musique, de la création sonore et de la production. Un espace de découverte, d'apprentissage et de collaboration pour révéler leur potentiel créatif.
                  </p>
                  <Button asChild size="lg">
                    <Link to="/atelier">Voir l'Atelier en détail</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Abonnements Preview */}
          <section className="py-20">
            <div className="container px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="mb-6">Rejoindre Le Trousseau</h2>
                  <p className="text-lg text-foreground/80 leading-relaxed max-w-3xl mx-auto">
                    Des vidéos gratuites, des rencontres, des ateliers et un accompagnement sur mesure pour avancer à ton rythme.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="text-center p-6 rounded-lg bg-secondary">
                    <div className="text-4xl font-bold text-primary mb-2">0</div>
                    <h3 className="text-xl font-heading font-semibold mb-3">To to to</h3>
                    <p className="text-sm text-foreground/70 mb-4">
                      Newsletter, vidéos gratuites et accès à la communauté
                    </p>
                    <p className="text-2xl font-bold">Gratuit</p>
                  </div>

                  <div className="text-center p-6 rounded-lg bg-secondary">
                    <div className="text-4xl font-bold text-primary mb-2">1</div>
                    <h3 className="text-xl font-heading font-semibold mb-3">Passe-partout</h3>
                    <p className="text-sm text-foreground/70 mb-4">
                      Corpus complet et sessions collectives mensuelles
                    </p>
                    <p className="text-2xl font-bold">12 €/mois</p>
                  </div>

                  <div className="text-center p-6 rounded-lg bg-primary text-primary-foreground">
                    <div className="text-4xl font-bold mb-2">2</div>
                    <h3 className="text-xl font-heading font-semibold mb-3">Sésame</h3>
                    <p className="text-sm mb-4 opacity-90">
                      Accompagnement complet : studio, masterclass et suivi individuel
                    </p>
                    <p className="text-2xl font-bold">45 €/mois</p>
                  </div>
                </div>

                <div className="text-center">
                  <Button asChild size="lg">
                    <Link to="/accompagnement#tarifs">Découvrir les formules</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Partenaires */}
          <section className="py-20 bg-light-grey">
            <div className="container px-4">
              <h2 className="text-center mb-12">Nos Partenaires</h2>
              
              <div className="flex flex-wrap justify-center items-center gap-12 mb-8">
                <div className="text-center">
                  <div className="font-heading font-bold text-2xl text-primary">EVRGRN</div>
                  <p className="text-sm text-foreground/60">Label & Édition musicale</p>
                </div>
                <div className="text-center">
                  <div className="font-heading font-bold text-2xl text-primary">Mardi Gras</div>
                  <p className="text-sm text-foreground/60">Création artistique</p>
                </div>
                <div className="text-center">
                  <div className="font-heading font-bold text-2xl text-primary">G-Base Studio</div>
                  <p className="text-sm text-foreground/60">Studio de production</p>
                </div>
              </div>

              <p className="text-center text-foreground/60">
                Nos partenaires soutiennent la création, la pédagogie et la transmission.
              </p>
            </div>
          </section>

          {/* Newsletter & Contact */}
          <section id="contact" className="py-20 bg-primary text-primary-foreground">
            <div className="container px-4">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="mb-6 text-primary-foreground">Restez informé des prochains ateliers et ressources</h2>
                
                <form className="mb-8">
                  <div className="flex gap-2 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Votre email"
                      className="flex-1 px-4 py-3 rounded-md text-foreground"
                      required
                    />
                    <Button type="submit" variant="secondary" size="lg">
                      S'inscrire
                    </Button>
                  </div>
                  <p className="text-xs mt-3 text-primary-foreground/80">
                    En vous inscrivant, vous acceptez de recevoir les actualités du Trousseau.
                  </p>
                </form>

                <div className="space-y-2 text-primary-foreground/90">
                  <p>📧 contact@letrousseau.fr</p>
                  <p>📞 06 XX XX XX XX</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Home;
