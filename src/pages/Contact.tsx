import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Captcha from "@/components/Captcha";
import { useQuiz } from "@/contexts/QuizContext";
import { useEffect, useState } from "react";
import formSubmissionService from "@/services/FormSubmissionService";
import { toast } from "sonner";

const Contact = () => {
  const { userInfo } = useQuiz();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    newsletter: false,
  });

  useEffect(() => {
    if (userInfo) {
      setForm((prev) => ({
        ...prev,
        name: userInfo.name || userInfo.pseudonym || prev.name,
        email: userInfo.email || prev.email,
        phone: userInfo.phone || prev.phone,
      }));
    }
  }, [userInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) return;
    
    setIsSubmitting(true);
    try {
      const result = await formSubmissionService.submitForm({
        source: 'contact' as const,
        consent: true,
        ...form
      } as any);
      
      if (result.success) {
        toast.success("Message envoyé avec succès !");
        setForm({ name: "", email: "", phone: "", subject: "", message: "", newsletter: false });
        setCaptchaToken(null);
      } else {
        toast.error(result.error || "Erreur lors de l'envoi");
      }
    } catch (error) {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contact — Le Trousseau</title>
      </Helmet>

      <Navigation />

      <main className="flex-1">
        <section className="py-16">
          <div className="container px-4 max-w-3xl">
            <h1 className="mb-6">Contact</h1>
            <p className="text-foreground/80 mb-8">
              Écris-nous un message. Tu peux aussi t'inscrire à la newsletter.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Objet</Label>
                  <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={6} required />
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox id="newsletter" checked={form.newsletter} onCheckedChange={(val) => setForm({ ...form, newsletter: Boolean(val) })} />
                <Label htmlFor="newsletter">S'inscrire aussi à la newsletter</Label>
              </div>

              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Checkbox id="consent" required />
                <Label htmlFor="consent" className="font-normal">
                  J'accepte que Le Trousseau collecte et conserve mes réponses pour me contacter et améliorer les programmes. 
                  <a href="/politique-confidentialite" className="underline ml-1">Politique de confidentialité</a>
                </Label>
              </div>

              <Captcha onVerify={setCaptchaToken} />

              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={!captchaToken || isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Envoyer"}
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
