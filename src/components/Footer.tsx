import { Facebook, Instagram, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Captcha from "@/components/Captcha";
import formSubmissionService from "@/services/FormSubmissionService";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const NewsletterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) return;
    
    try {
      const result = await formSubmissionService.submitForm({
        source: 'newsletter' as const,
        consent: true,
        name,
        email
      } as any);
      
      if (result.success) {
        toast.success("Inscription réussie !");
        setName("");
        setEmail("");
        setCaptchaToken(null);
      } else {
        toast.error(result.error || "Erreur");
      }
    } catch (error) {
      toast.error("Erreur lors de l'inscription");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          required
        />
      </div>
      <div className="flex gap-2">
        <Input 
          type="email" 
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          required
        />
      </div>
      <div className="flex items-start space-x-2 text-xs text-white/70">
        <Checkbox id="newsletter-consent" required className="mt-1" />
        <Label htmlFor="newsletter-consent" className="font-normal leading-tight">
          J'accepte la collecte de mes données
        </Label>
      </div>
      <Captcha onVerify={setCaptchaToken} theme="dark" />
      <Button className="bg-primary hover:bg-primary/90 w-full" disabled={!captchaToken}>
        OK
      </Button>
    </form>
  );
};

const Footer = () => {
  return (
    <footer className="bg-deep-black text-white py-12">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Le Trousseau</h3>
              <p className="text-white/80 mb-4">
                Atelier Création & Production Musicale pour jeunes (12–18 ans)
              </p>
              <div className="flex gap-3">
                <a 
                  href="https://www.facebook.com/letrousseau" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.instagram.com/letrousseau" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-white/80">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  contact@letrousseau.fr
                </p>
                <p>Téléphone : À venir</p>
                <p>Zone : Île-de-France</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-white/80 mb-3 text-sm">
                Inscrivez-vous pour recevoir la brochure & actualités
              </p>
              <NewsletterForm />
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
              <p>© 2025 Le Trousseau (EVRGRN). Tous droits réservés.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-primary transition-colors">
                  Mentions légales
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  Politique de confidentialité
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
