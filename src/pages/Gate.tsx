import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import keyLogo from "@/assets/key-logo.png";
import { Instagram, Video } from "lucide-react";

const Gate = () => {
  return (
    <>
      <Helmet>
        <title>Le Trousseau - Création • Transmission • Autonomie</title>
        <meta name="description" content="Le Trousseau accompagne les artistes indépendants et les associations dans leur développement créatif et autonome." />
      </Helmet>
      
      <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
          {/* Logo */}
          <img 
            src={keyLogo} 
            alt="Logo Le Trousseau - Clé dorée" 
            className="w-32 h-32 md:w-40 md:h-40 object-contain mb-8 md:mb-12"
          />
          
          {/* Titre principal */}
          <h1 className="font-heading font-bold text-4xl md:text-6xl mb-4 md:mb-6 text-deep-black">
            LE TROUSSEAU
          </h1>
          
          {/* Baseline */}
          <p className="font-sans text-sm md:text-base text-medium-grey mb-12 md:mb-16">
            Création • Transmission • Autonomie
          </p>
          
          {/* Boutons */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-xl">
            <Link
              to="/diagnostic"
              className="flex-1 px-8 py-4 rounded-md font-sans font-semibold text-white transition-all duration-300 bg-primary hover:bg-primary/90"
            >
              Je suis un artiste
            </Link>
            
            <Link
              to="/atelier"
              className="flex-1 px-8 py-4 rounded-md font-sans font-semibold text-white transition-all duration-300 bg-deep-black hover:opacity-90"
            >
              Je suis une association
            </Link>
          </div>
          
          {/* Social Media Links */}
          <div className="mt-12 flex justify-center gap-6">
            <a 
              href="https://www.instagram.com/mathisoneblaze" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-medium-grey hover:text-emerald transition-colors"
              aria-label="Instagram de Mathis OneBlaze"
            >
              <Instagram size={28} />
            </a>
            <a 
              href="https://www.youtube.com/watch?v=vnp-G_r2WAk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-medium-grey hover:text-emerald transition-colors"
              aria-label="YouTube Le Trousseau"
            >
              <Video size={28} />
            </a>
            <a 
              href="https://www.tiktok.com/@mathisoneblaze" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-medium-grey hover:text-emerald transition-colors"
              aria-label="TikTok de Mathis OneBlaze"
            >
              <svg 
                viewBox="0 0 24 24" 
                width="28" 
                height="28" 
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gate;
