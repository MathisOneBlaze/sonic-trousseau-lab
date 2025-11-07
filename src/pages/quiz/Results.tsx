import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQuiz } from "@/contexts/QuizContext";
import { calculateScore, getArchetype, getInsights, getRecommendedOffer } from "@/lib/quizData";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import formSubmissionService from "@/services/FormSubmissionService";

const QuizResults = () => {
  const navigate = useNavigate();
  const { userInfo, answers, resetQuiz } = useQuiz();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    if (!userInfo || answers.length === 0) {
      navigate("/diagnostic");
    }
  }, [userInfo, answers, navigate]);

  // Submit quiz results on mount
  useEffect(() => {
    const submitQuizResults = async () => {
      if (userInfo && answers.length > 0 && !quizSubmitted) {
        const score = calculateScore(answers);
        const archetype = getArchetype(score);
        const stats = {
          discipline: Math.round(score * 0.9),
          creation: Math.round(score * 1.1),
          interpretation: Math.round(score * 0.95),
          organisation: Math.round(score * 0.85)
        };

        try {
          const quizData: Omit<import('@/types/submission').QuizSubmission, 'id' | 'timestamp'> = {
            source: 'quiz',
            consent: userInfo.consent || false,
            userInfo: {
              name: userInfo.name,
              pseudonym: userInfo.pseudonym,
              email: userInfo.email,
              phone: userInfo.phone,
              age: userInfo.age,
              location: userInfo.location
            },
            answers,
            results: {
              score,
              archetype,
              stats,
              recommendedOffer: getRecommendedOffer(archetype).title
            }
          };
          
          await formSubmissionService.submitForm(quizData);
          setQuizSubmitted(true);
        } catch (error) {
          console.error('Failed to submit quiz results:', error);
        }
      }
    };

    submitQuizResults();
  }, [userInfo, answers, quizSubmitted]);

  if (!userInfo || answers.length === 0) {
    return null;
  }

  const score = calculateScore(answers);
  const archetype = getArchetype(score);
  const insights = getInsights(archetype);
  const offer = getRecommendedOffer(archetype);

  // Calculate stats based on score distribution
  const stats = {
    discipline: Math.round(score * 0.9),
    creation: Math.round(score * 1.1),
    interpretation: Math.round(score * 0.95),
    organisation: Math.round(score * 0.85)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !userInfo) return;

    setSending(true);

    try {
      const contactData: Omit<import('@/types/submission').ContactSubmission, 'id' | 'timestamp'> = {
        source: 'contact',
        consent: userInfo.consent || false,
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        subject: `Message après quiz - ${archetype}`,
        message: message,
        newsletter: false
      };

      const result = await formSubmissionService.submitForm(contactData);

      if (result.success) {
        toast.success("Message envoyé ! Nous te contacterons bientôt.");
        setMessage("");
      } else {
        toast.error(result.error || "Une erreur est survenue");
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Tes Résultats - Le Trousseau</title>
      </Helmet>

      <Navigation />

      <div className="min-h-screen bg-light-grey py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Score and Archetype */}
          <div className="bg-background rounded-lg shadow-lg p-8 md:p-12 mb-8 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-deep-black mb-4">
              Ton Score : {score}/100
            </h1>
            <div className="inline-block bg-emerald text-white px-8 py-3 rounded-full text-xl font-bold">
              {archetype}
            </div>
          </div>

          {/* Stats Gauges */}
          <div className="bg-background rounded-lg shadow-lg p-8 md:p-12 mb-8">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-deep-black mb-8 text-center">
              Tes Statistiques
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center">
                  <div className="relative w-16 h-48 bg-muted rounded-full overflow-hidden mb-4">
                    <div 
                      className="absolute bottom-0 w-full bg-emerald transition-all duration-1000 ease-out"
                      style={{ height: `${value}%` }}
                    />
                  </div>
                  <span className="font-semibold text-deep-black capitalize text-sm text-center">
                    {key}
                  </span>
                  <span className="text-medium-grey text-xs mt-1">
                    {value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-background rounded-lg shadow-lg p-8 md:p-12 mb-8">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-deep-black mb-6">
              Ce que ça signifie pour toi
            </h2>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald mt-2 flex-shrink-0" />
                  <p className="text-lg text-medium-grey">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Offer */}
          <div className="bg-emerald text-white rounded-lg shadow-lg p-8 md:p-12 mb-8">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
              {offer.title}
            </h2>
            <p className="text-lg mb-6 opacity-90">
              {offer.description}
            </p>
            <Button 
              size="lg"
              className="bg-white text-emerald hover:bg-white/90 font-semibold text-lg px-8 py-6"
              onClick={() => navigate("/accompagnement#tarifs")}
            >
              {offer.cta}
            </Button>
          </div>

          {/* Contact Form */}
          <div className="bg-background rounded-lg shadow-lg p-8 md:p-12">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-deep-black mb-4">
              Une question ? Un message ?
            </h2>
            <p className="text-medium-grey mb-6">
              Partage tes réflexions ou pose-nous tes questions. Nous te répondrons rapidement.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Ton message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écris ton message ici..."
                  className="min-h-[150px]"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-emerald hover:bg-emerald/90 text-white font-semibold text-lg py-6"
              >
                {sending ? "Envoi en cours..." : "Envoyer"}
              </Button>
            </form>
          </div>

          {/* Reset Quiz */}
          <div className="text-center mt-8">
            <button
              onClick={() => {
                resetQuiz();
                navigate("/diagnostic");
              }}
              className="text-medium-grey hover:text-emerald underline"
            >
              Recommencer le quiz
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizResults;
