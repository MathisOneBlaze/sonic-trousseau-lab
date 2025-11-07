import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuiz } from "@/contexts/QuizContext";
import Navigation from "@/components/Navigation";
import { quizQuestions } from "@/lib/quizData";
import Captcha from "@/components/Captcha";
import { Checkbox } from "@/components/ui/checkbox";

const QuizStart = () => {
  const navigate = useNavigate();
  const { setUserInfo, answers } = useQuiz();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    pseudonym: "",
    email: "",
    phone: "",
    age: "",
    location: ""
  });

  useEffect(() => {
    // Simple geolocation to prefill location
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        if (data.city && data.country_name) {
          setFormData(prev => ({ ...prev, location: `${data.city}, ${data.country_name}` }));
        }
      })
      .catch(() => {
        // Silently fail, user can fill manually
      });
  }, []);

  useEffect(() => {
    if (answers && answers.length > 0) {
      const answeredIds = new Set(answers.map(a => a.questionId));
      const next = quizQuestions.find(q => !answeredIds.has(q.id));
      if (next) {
        navigate(`/diagnostic/question/${next.id}`);
      } else {
        navigate("/diagnostic/resultats");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      return;
    }
    setUserInfo({ ...formData, consent });
    navigate("/diagnostic/question/1");
  };

  return (
    <>
      <Helmet>
        <title>Identité Artiste - Le Trousseau</title>
        <meta name="description" content="Commence ton diagnostic créatif" />
      </Helmet>

      <Navigation />

      <div className="min-h-screen bg-light-grey flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-background rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-deep-black mb-2 text-center">
            Qui es-tu ?
          </h1>
          <p className="text-medium-grey text-center mb-8">Réponds à ce questionnaire de 2 minutes pour nous permettre de trouver les clés dont tu auras besoin.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pseudonym">Pseudonyme</Label>
              <Input
                id="pseudonym"
                required
                value={formData.pseudonym}
                onChange={(e) => setFormData({ ...formData, pseudonym: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Âge</Label>
              <Input
                id="age"
                type="number"
                required
                min="7"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="flex items-start space-x-3 space-y-0">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked === true)}
              />
              <label htmlFor="consent" className="text-sm text-medium-grey leading-tight cursor-pointer">
                J'accepte que Le Trousseau collecte et conserve mes réponses pour me contacter et améliorer les programmes. 
                En savoir plus sur notre <a href="/politique-confidentialite" className="text-emerald underline">politique de confidentialité</a>.
              </label>
            </div>

            <Captcha onVerify={setCaptchaToken} />

            <Button
              type="submit"
              className="w-full bg-emerald hover:bg-emerald/90 text-white font-semibold text-lg py-6"
              disabled={!captchaToken || !consent}
            >
              Commencer le Quiz
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default QuizStart;
