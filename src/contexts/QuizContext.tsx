import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { UserInfo, QuizAnswer } from "@/lib/quizData";

interface QuizContextType {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;
  answers: QuizAnswer[];
  addAnswer: (answer: QuizAnswer) => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("quiz_user_info");
      const storedAnswers = localStorage.getItem("quiz_answers");
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser));
      }
      if (storedAnswers) {
        setAnswers(JSON.parse(storedAnswers));
      }
    } catch {
      // ignore parse errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      if (userInfo) {
        localStorage.setItem("quiz_user_info", JSON.stringify(userInfo));
      }
    } catch {}
  }, [userInfo]);

  useEffect(() => {
    try {
      localStorage.setItem("quiz_answers", JSON.stringify(answers));
    } catch {}
  }, [answers]);

  const addAnswer = (answer: QuizAnswer) => {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === answer.questionId);
      if (existing !== -1) {
        const newAnswers = [...prev];
        newAnswers[existing] = answer;
        return newAnswers;
      }
      return [...prev, answer];
    });
  };

  const resetQuiz = () => {
    setUserInfo(null);
    setAnswers([]);
    try {
      localStorage.removeItem("quiz_user_info");
      localStorage.removeItem("quiz_answers");
    } catch {}
  };

  return (
    <QuizContext.Provider value={{ userInfo, setUserInfo, answers, addAnswer, resetQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
