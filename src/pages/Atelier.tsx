import Hero from "@/components/Hero";
import TrainerPresentation from "@/components/TrainerPresentation";
import Philosophy from "@/components/Philosophy";
import AudienceInfo from "@/components/AudienceInfo";
import ModulesTable from "@/components/ModulesTable";
import FormatsCalendar from "@/components/FormatsCalendar";
import Pricing from "@/components/Pricing";
import TechnicalResources from "@/components/TechnicalResources";
import Results from "@/components/Results";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Atelier = () => {
  const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Le Trousseau",
    "url": "https://www.letrousseau.fr",
    "logo": "https://www.letrousseau.fr/assets/logo.png",
    "email": "contact@letrousseau.fr",
    "sameAs": [
      "https://www.facebook.com/letrousseau",
      "https://www.instagram.com/letrousseau"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "FR",
      "addressLocality": "Paris"
    }
  };

  const jsonLdCourse = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Atelier Création & Production Musicale — Cycle complet",
    "provider": {
      "@type": "Organization",
      "name": "Le Trousseau",
      "url": "https://www.letrousseau.fr"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "OnSite",
      "startDate": "2025-10-01",
      "endDate": "2025-12-01",
      "location": {
        "@type": "Place",
        "name": "Studio partenaire — Île-de-France"
      }
    },
    "description": "Cycle 6×4h + 2 journées (studio + clip): écriture, composition, enregistrement, diffusion.",
    "occupationalCredentialAwarded": "Attestation de participation"
  };

  return (
    <>
      <Helmet>
        <title>Atelier Création & Production Musicale — Le Trousseau</title>
        <meta name="description" content="Atelier pour jeunes (12-18 ans) animé par Mathis OneBlaze. Cycle complet: écriture, production, enregistrement studio et diffusion." />
        <script type="application/ld+json">
          {JSON.stringify(jsonLdOrganization)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(jsonLdCourse)}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1">
          <div className="container px-4 py-8">
            <Button asChild variant="outline" className="mb-6">
              <Link to="/">← Retour à l'accueil</Link>
            </Button>
          </div>
          
          <Hero />
          <TrainerPresentation />
          <Philosophy />
          <AudienceInfo />
          <ModulesTable />
          <FormatsCalendar />
          <Pricing />
          <TechnicalResources />
          <Results />
          <FAQ />
          <ContactForm />
          <Footer />
        </main>
      </div>
    </>
  );
};

export default Atelier;
