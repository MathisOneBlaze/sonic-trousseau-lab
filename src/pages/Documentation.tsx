import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, List, Link as LinkIcon, BarChart3 } from "lucide-react";
import livreTrousseau from "@/assets/livre-trousseau.jpg";

const Documentation = () => {
  const resources = [
    { icon: List, title: "Index", description: "Parcourir l'index complet du livre" },
    { icon: BookOpen, title: "Exercices", description: "Accéder aux exercices pratiques" },
    { icon: LinkIcon, title: "Sources", description: "Consulter les sources et références" },
    { icon: BarChart3, title: "Schéma & graphiques", description: "Voir les schémas et visualisations" },
  ];

  return (
    <>
      <Helmet>
        <title>Documentation & Ressources — Le Trousseau</title>
        <meta
          name="description"
          content="Découvrez le livre Le Trousseau et accédez aux ressources pédagogiques, exercices, sources et schémas."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-20 bg-secondary">
            <div className="container px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="mb-6">Documentation & Ressources</h1>
                <p className="text-xl text-foreground/80 mb-8">
                  Découvrez le livre "Le Trousseau" et explorez notre bibliothèque de ressources pédagogiques.
                </p>
              </div>
            </div>
          </section>

          {/* Le Livre Section */}
          <section className="py-20">
            <div className="container px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                  <div className="flex justify-center">
                    <Card className="p-8 bg-background shadow-xl">
                      <img
                        src={livreTrousseau}
                        alt="Couverture du livre Le Trousseau - Un livre de clés pour déverrouiller ton génie"
                        className="w-full h-auto rounded-lg"
                        loading="lazy"
                      />
                    </Card>
                  </div>

                  <div>
                    <h2 className="mb-6">Le Trousseau</h2>
                    <p className="text-lg text-foreground/80 leading-relaxed mb-4">
                      <strong>Un livre de clés pour déverrouiller ton génie</strong>
                    </p>
                    <p className="text-foreground/80 leading-relaxed mb-6">
                      Écrit par Mathis Moncoq (Mathis OneBlaze), ce livre rassemble les outils, méthodes et réflexions pour développer votre créativité, votre autonomie et votre potentiel artistique.
                    </p>
                    
                    <div className="mb-6">
                      <Button size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-600/90 text-white">
                        Acheter le livre
                      </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {resources.map((resource, index) => {
                        const Icon = resource.icon;
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            className="h-auto py-4 px-6 flex flex-col items-start gap-2"
                            asChild
                          >
                            <a href="#" onClick={(e) => e.preventDefault()}>
                              <div className="flex items-center gap-2 w-full">
                                <Icon className="w-5 h-5 text-primary" />
                                <span className="font-semibold">{resource.title}</span>
                              </div>
                              <span className="text-xs text-foreground/60 text-left">
                                {resource.description}
                              </span>
                            </a>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Chaîne YouTube */}
                <div className="mt-20">
                  <h2 className="mb-6 text-center">Chaîne YouTube</h2>
                  <p className="text-lg text-foreground/80 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
                    Retrouvez nos contenus vidéo: extraits d'ateliers, conseils et coulisses.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Vidéo 1 */}
                    <div className="bg-background border rounded-lg overflow-hidden shadow-sm">
                      <div className="aspect-video">
                        <iframe
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/vnp-G_r2WAk?rel=0&modestbranding=1"
                          title="Le Trousseau — Vidéo 1"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                      <div className="p-4">
                        <p className="font-semibold">Vidéo 1</p>
                        <a
                          href="https://www.youtube.com/watch?v=vnp-G_r2WAk"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary underline"
                        >Voir sur YouTube</a>
                      </div>
                    </div>

                    {/* Vidéo 2 (start à 602s) */}
                    <div className="bg-background border rounded-lg overflow-hidden shadow-sm">
                      <div className="aspect-video">
                        <iframe
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/PPJ2eFyoFMQ?rel=0&modestbranding=1&start=602"
                          title="Le Trousseau — Vidéo 2"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                      <div className="p-4">
                        <p className="font-semibold">Vidéo 2</p>
                        <a
                          href="https://www.youtube.com/watch?v=PPJ2eFyoFMQ&t=602s"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary underline"
                        >Voir sur YouTube</a>
                      </div>
                    </div>

                    {/* Vidéo 3 (start à 130s) */}
                    <div className="bg-background border rounded-lg overflow-hidden shadow-sm">
                      <div className="aspect-video">
                        <iframe
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/I8UyqZG3hi0?rel=0&modestbranding=1&start=130"
                          title="Le Trousseau — Vidéo 3"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                      <div className="p-4">
                        <p className="font-semibold">Vidéo 3</p>
                        <a
                          href="https://www.youtube.com/watch?v=I8UyqZG3hi0&t=130s"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary underline"
                        >Voir sur YouTube</a>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-8">
                    <Button asChild size="lg">
                      <a href="https://www.youtube.com/@LeTrousseau-en-video" target="_blank" rel="noopener noreferrer">
                        Voir la chaîne
                      </a>
                    </Button>
                  </div>
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

export default Documentation;
