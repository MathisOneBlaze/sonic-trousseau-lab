import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useQuiz } from "@/contexts/QuizContext";
import { quizQuestions } from "@/lib/quizData";
import Navigation from "@/components/Navigation";
import { useEffect } from "react";

const QuizQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const questionId = parseInt(id || "1");
  const { addAnswer, answers } = useQuiz();
  
  const question = quizQuestions.find(q => q.id === questionId);
  const [selectedOption, setSelectedOption] = useState("");
  const [openAnswer, setOpenAnswer] = useState("");

  if (!question) {
    navigate("/diagnostic");
    return null;
  }

  const progress = (questionId / quizQuestions.length) * 100;

  useEffect(() => {
    const existing = answers.find(a => a.questionId === questionId);
    if (existing) {
      if (question.type === "closed") {
        if (typeof existing.answer === "string") {
          setSelectedOption(existing.answer);
        } else if (existing.answer && typeof existing.answer === "object" && "text" in existing.answer) {
          setSelectedOption((existing.answer as any).text);
        }
      } else {
        setOpenAnswer(String(existing.answer ?? ""));
      }
    } else {
      setSelectedOption("");
      setOpenAnswer("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const handleNext = () => {
    if (question.type === "closed") {
      const selectedOpt = question.options?.find(opt => opt.text === selectedOption);
      if (selectedOpt) {
        addAnswer({
          questionId: question.id,
          answer: selectedOption,
          value: selectedOpt.value
        });
      }
    } else {
      addAnswer({
        questionId: question.id,
        answer: openAnswer
      });
    }

    if (questionId < quizQuestions.length) {
      navigate(`/diagnostic/question/${questionId + 1}`);
    } else {
      navigate("/diagnostic/resultats");
    }
  };

  const canProceed = question.type === "closed" 
    ? selectedOption !== "" 
    : openAnswer.trim() !== "";

  return (
    <>
      <Helmet>
        <title>Question {questionId} - Le Trousseau</title>
      </Helmet>

      <Navigation />

      <div className="min-h-screen bg-light-grey flex flex-col">
        {/* Progress bar */}
        <div className="bg-background border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm font-medium text-medium-grey">
                Question {questionId} / {quizQuestions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-2xl bg-background rounded-lg shadow-lg p-8 md:p-12">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-deep-black mb-8">
              {question.question}
            </h2>

            {question.type === "closed" && question.options ? (
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                <div className="space-y-4">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 rounded-lg border border-input hover:bg-muted/30 transition-colors">
                      <RadioGroupItem value={option.text} id={`option-${index}`} />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="flex-1 cursor-pointer text-base"
                      >
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <Textarea
                value={openAnswer}
                onChange={(e) => setOpenAnswer(e.target.value)}
                placeholder="Écris ta réponse ici..."
                className="min-h-[200px] text-base"
              />
            )}

            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="w-full mt-8 bg-emerald hover:bg-emerald/90 text-white font-semibold text-lg py-6"
            >
              {questionId < quizQuestions.length ? "Suivant" : "Voir mes résultats"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizQuestion;
