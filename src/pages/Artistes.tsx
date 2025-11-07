import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import heroImage from "@/assets/artist-hero-writing.jpg";
import mathisPortrait from "@/assets/mathis-portrait-new.jpg";
import { Instagram, Music, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const Artistes = () => {
  return (
    <>
      <Helmet>
        <title>Artistes - Le Trousseau | Formation et accompagnement musical</title>
        <meta name="description" content="Marre de ne pas finir tes chansons ? Réponds au quiz pour comprendre ce qui te bloque et passer à l'étape suivante." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center text-white">
            <h1 className="font-heading font-bold text-5xl md:text-7xl mb-6 leading-tight">
              Marre de ne pas finir tes chansons
            </h1>
            
            <p className="text-2xl md:text-3xl mb-8 font-medium">
              Es-tu prêt à passer à l'étape suivante ?
            </p>
            
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Réponds à ces 15 questions pour comprendre pourquoi tu n'y arrives pas
            </p>
            
            <Link to="/quiz/start">
              <Button 
                size="lg"
                className="bg-emerald hover:bg-emerald/90 text-white font-semibold text-lg px-10 py-6 h-auto rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Répondre au quiz (2 minutes)
              </Button>
            </Link>
          </div>
        </section>
        
        {/* Value Proposition Section */}
        <section className="py-20 bg-light-grey">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-center mb-12 text-deep-black">
              Pourquoi ce quiz va t'aider
            </h2>
            
            <p className="text-xl text-center mb-16 text-medium-grey">
              En répondant à ce test, tu nous permet de t'aider à :
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-emerald/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Music className="w-8 h-8 text-emerald" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-4 text-center text-deep-black">
                  Améliorer ton efficacité et ta rapidité de création
                </h3>
                <p className="text-medium-grey text-center">
                  Identifie les blocages qui ralentissent ton processus créatif
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-emerald/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-semibold mb-4 text-center text-deep-black">
                  Accélérer ta capacité à trouver des idées
                </h3>
                <p className="text-medium-grey text-center">
                  Découvre des techniques pour débloquer ton inspiration
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-emerald/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-semibold mb-4 text-center text-deep-black">
                  Dompter le syndrome de l'imposteur
                </h3>
                <p className="text-medium-grey text-center">
                  Comprends ce qui t'empêche de te sentir légitime
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Credibility Section - Qui est Mathis OneBlaze */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-center mb-12 text-deep-black">
              Qui est Mathis OneBlaze
            </h2>
            
            {/* Photo et réseaux sociaux centrés */}
            <div className="flex flex-col items-center mb-12">
              <img 
                src={mathisPortrait} 
                alt="Mathis OneBlaze - Formateur en création musicale"
                className="rounded-lg shadow-xl w-64 h-64 object-cover mb-6"
              />
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-emerald/10 rounded-full flex items-center justify-center hover:bg-emerald/20 transition-colors"
                >
                  <Instagram className="w-6 h-6 text-emerald" />
                </a>
                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-emerald/10 rounded-full flex items-center justify-center hover:bg-emerald/20 transition-colors"
                >
                  <Music className="w-6 h-6 text-emerald" />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-emerald/10 rounded-full flex items-center justify-center hover:bg-emerald/20 transition-colors"
                >
                  <Video className="w-6 h-6 text-emerald" />
                </a>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                  <h3 className="font-heading text-2xl font-semibold mb-4 text-emerald">
                    Parcours artistique
                  </h3>
                  <ul className="space-y-3 text-medium-grey">
                    <li className="flex items-start">
                      <span className="text-emerald mr-3">•</span>
                      <span>Auteur, compositeur, interprète depuis 2006 (20 ans de pratique)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald mr-3">•</span>
                      <span>Artiste multidisciplinaire : danse, graff, DJing, cinéma, mode</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald mr-3">•</span>
                      <span>Collaborations avec des artistes majeurs de la scène antillaise</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald mr-3">•</span>
                      <span>Pionnier : popularisation du battle rap en créole aux Antilles</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-heading text-2xl font-semibold mb-4 text-emerald">
                    Formation technique
                  </h3>
                  <ul className="space-y-3 text-medium-grey">
                    <li className="flex items-start">
                      <span className="text-emerald mr-3">•</span>
                      <span>10 ans d'expérience en ingénierie sonore</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald mr-3">•</span>
                      <span>Diplôme BTS audiovisuel (montage et post-production) obtenu à l'INA – Institut National de l'Audiovisuel</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald mr-3">•</span>
                      <span>BAFA (pédagogie et transmission)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald mr-3">•</span>
                      <span>Autodidacte sur théorie musicale et production</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-heading text-2xl font-semibold mb-4 text-emerald">
                    Offre pédagogique
                  </h3>
                  <ul className="space-y-3 text-medium-grey">
                    <li className="flex items-start">
                      <span className="text-emerald mr-3">•</span>
                      <span>Écriture d'un livre « Le Trousseau : Un livre de clés pour déverrouiller ton génie »</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald mr-3">•</span>
                      <Link to="/atelier" className="underline decoration-emerald decoration-2 underline-offset-4 hover:text-emerald transition-colors">
                        Atelier Le Trousseau 7 à 77 ans
                      </Link>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald mr-3">•</span>
                      <Link to="/programme" className="underline decoration-emerald decoration-2 underline-offset-4 hover:text-emerald transition-colors">
                        Coaching personnalisé
                      </Link>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald mr-3">•</span>
                      <span>Contenu vidéo long et court sur YouTube</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="py-20 bg-deep-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
              Prêt à débloquer ta créativité ?
            </h2>
            <p className="text-xl mb-10 text-light-grey">
              Commence maintenant
            </p>
            <Link to="/quiz/start">
              <Button 
                size="lg"
                className="bg-emerald hover:bg-emerald/90 text-white font-semibold text-lg px-10 py-6 h-auto rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Répondre au quiz
              </Button>
            </Link>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default Artistes;
