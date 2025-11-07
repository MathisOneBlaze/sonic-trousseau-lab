export interface QuizQuestion {
  id: number;
  question: string;
  type: "closed" | "open";
  options?: { text: string; value: number }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "À quelle fréquence commences-tu un nouveau morceau ?",
    type: "closed",
    options: [
      { text: "Rarement (moins d'une fois par mois)", value: 0 },
      { text: "Parfois (1-2 fois par mois)", value: 2 },
      { text: "Régulièrement (1 fois par semaine)", value: 4 },
      { text: "Très souvent (plusieurs fois par semaine)", value: 6 }
    ]
  },
  {
    id: 2,
    question: "Combien de morceaux as-tu finis au cours des 6 derniers mois ?",
    type: "closed",
    options: [
      { text: "Aucun", value: 0 },
      { text: "1-2 morceaux", value: 2 },
      { text: "3-5 morceaux", value: 4 },
      { text: "Plus de 5 morceaux", value: 6 }
    ]
  },
  {
    id: 3,
    question: "Quand tu bloques sur un morceau, que fais-tu généralement ?",
    type: "closed",
    options: [
      { text: "J'abandonne et je passe à autre chose", value: 0 },
      { text: "Je le mets de côté en espérant y revenir", value: 2 },
      { text: "Je cherche de l'aide ou des conseils", value: 4 },
      { text: "Je persiste jusqu'à trouver une solution", value: 6 }
    ]
  },
  {
    id: 4,
    question: "Comment évalues-tu ta discipline créative ?",
    type: "closed",
    options: [
      { text: "Je crée uniquement quand l'inspiration vient", value: 0 },
      { text: "J'essaie d'être régulier mais c'est difficile", value: 3 },
      { text: "J'ai des routines mais pas toujours respectées", value: 5 },
      { text: "J'ai une discipline quotidienne stricte", value: 8 }
    ]
  },
  {
    id: 5,
    question: "Quelle est ta plus grande difficulté en composition ?",
    type: "closed",
    options: [
      { text: "Trouver des idées de départ", value: 0 },
      { text: "Développer mes idées", value: 2 },
      { text: "Finir ce que j'ai commencé", value: 4 },
      { text: "Savoir quand un morceau est vraiment fini", value: 6 }
    ]
  },
  {
    id: 6,
    question: "Comment te sens-tu par rapport à tes compétences techniques ?",
    type: "closed",
    options: [
      { text: "Je manque de bases techniques", value: 0 },
      { text: "J'ai quelques bases mais je suis limité", value: 2 },
      { text: "Je maîtrise bien mais je peux progresser", value: 4 },
      { text: "Je me sens très à l'aise techniquement", value: 6 }
    ]
  },
  {
    id: 7,
    question: "À quelle fréquence partages-tu ta musique avec d'autres ?",
    type: "closed",
    options: [
      { text: "Jamais, je garde tout pour moi", value: 0 },
      { text: "Rarement, seulement à des proches", value: 2 },
      { text: "Parfois, sur les réseaux ou à des amis", value: 4 },
      { text: "Régulièrement, je cherche du feedback", value: 6 }
    ]
  },
  {
    id: 8,
    question: "Comment gères-tu la critique de ton travail ?",
    type: "closed",
    options: [
      { text: "Je la prends très mal et me décourage", value: 0 },
      { text: "Je l'évite autant que possible", value: 2 },
      { text: "Je l'accepte mais c'est difficile", value: 4 },
      { text: "Je la recherche pour progresser", value: 6 }
    ]
  },
  {
    id: 9,
    question: "Combien de temps passes-tu par semaine sur ta musique ?",
    type: "closed",
    options: [
      { text: "Moins d'une heure", value: 0 },
      { text: "1-3 heures", value: 2 },
      { text: "4-7 heures", value: 4 },
      { text: "Plus de 7 heures", value: 6 }
    ]
  },
  {
    id: 10,
    question: "Comment décrirais-tu ton environnement de création ?",
    type: "closed",
    options: [
      { text: "Pas d'espace dédié, je fais avec ce que j'ai", value: 0 },
      { text: "Un coin chez moi mais pas optimal", value: 2 },
      { text: "Un espace dédié mais basique", value: 4 },
      { text: "Un vrai studio bien équipé", value: 6 }
    ]
  },
  {
    id: 11,
    question: "Quel est ton principal obstacle créatif ?",
    type: "closed",
    options: [
      { text: "Le manque de temps", value: 0 },
      { text: "Le manque de confiance en moi", value: 0 },
      { text: "Le perfectionnisme", value: 0 },
      { text: "Autre (précise à la question 15)", value: 0 }
    ]
  },
  {
    id: 12,
    question: "Décris brièvement ton parcours musical et tes objectifs",
    type: "open"
  },
  {
    id: 13,
    question: "As-tu déjà suivi une formation musicale ?",
    type: "closed",
    options: [
      { text: "Non, jamais", value: 0 },
      { text: "Oui, en autodidacte (vidéos, livres)", value: 2 },
      { text: "Oui, quelques cours ou ateliers", value: 4 },
      { text: "Oui, une formation complète ou diplôme", value: 6 }
    ]
  },
  {
    id: 14,
    question: "Comment te projettes-tu dans 1 an avec ta musique ?",
    type: "closed",
    options: [
      { text: "Je ne sais pas vraiment", value: 0 },
      { text: "J'espère avoir progressé mais sans plan précis", value: 2 },
      { text: "J'ai quelques objectifs en tête", value: 5 },
      { text: "J'ai un plan clair et des objectifs précis", value: 8 }
    ]
  },
  {
    id: 15,
    question: "Si tu as coché 'Autre' à la question 11, précise ici ton obstacle principal. Sinon, partage tout ce qui pourrait nous aider à mieux te comprendre.",
    type: "open"
  }
];

export interface UserInfo {
  name: string;
  pseudonym: string;
  email: string;
  phone: string;
  age: string;
  location: string;
  consent?: boolean;
}

export interface QuizAnswer {
  questionId: number;
  answer: string;
  value?: number;
}

export const calculateScore = (answers: QuizAnswer[]): number => {
  const closedAnswers = answers.filter(a => a.value !== undefined);
  const totalScore = closedAnswers.reduce((sum, a) => sum + (a.value || 0), 0);
  const maxPossibleScore = 78; // Sum of all max values
  return Math.round((totalScore / maxPossibleScore) * 100);
};

export const getArchetype = (score: number): string => {
  if (score < 30) return "Initié";
  if (score < 60) return "Aventurier";
  return "Conquérant";
};

export const getInsights = (archetype: string): string[] => {
  const insights = {
    "Initié": [
      "Tu es au début de ton voyage créatif. C'est normal de se sentir perdu parfois.",
      "La régularité et la discipline seront tes meilleurs alliés pour progresser rapidement.",
      "Tu as besoin d'un cadre structuré pour développer tes compétences et ta confiance."
    ],
    "Aventurier": [
      "Tu as déjà des bases solides mais tu manques de constance dans ta pratique.",
      "Tu es capable de créer mais tu as du mal à finaliser tes projets.",
      "Un accompagnement te permettrait de passer au niveau supérieur et de structurer ton travail."
    ],
    "Conquérant": [
      "Tu as une pratique régulière et tu maîtrises bien ton processus créatif.",
      "Tu es discipliné et tu sais finaliser tes projets.",
      "Tu es prêt pour un accompagnement avancé qui te permettra d'affiner ta vision artistique."
    ]
  };
  
  return insights[archetype as keyof typeof insights] || insights["Initié"];
};

export const getRecommendedOffer = (archetype: string): { title: string; description: string; cta: string } => {
  const offers = {
    "Initié": {
      title: "L'Atelier Le Trousseau",
      description: "Un atelier collectif pour acquérir les bases et développer une pratique régulière. Parfait pour démarrer avec un cadre structuré.",
      cta: "Découvrir l'atelier"
    },
    "Aventurier": {
      title: "Le Programme Le Trousseau",
      description: "Un accompagnement mensuel avec sessions collectives et coaching individuel pour structurer ton travail et finaliser tes projets.",
      cta: "Rejoindre le programme"
    },
    "Conquérant": {
      title: "Coaching Personnalisé",
      description: "Un suivi individuel sur-mesure pour affiner ta vision artistique et développer un projet professionnel cohérent.",
      cta: "Demander un coaching"
    }
  };
  
  return offers[archetype as keyof typeof offers] || offers["Initié"];
};
