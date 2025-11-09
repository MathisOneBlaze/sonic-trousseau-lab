/**
 * LLM prompt templates for content generation
 * Customizable templates for each platform and content type
 */

export const SYSTEM_PROMPTS = {
  CONTENT_CREATOR: `Tu es un expert en création de contenu pour les réseaux sociaux et le web.
Tu travailles pour "Le Trousseau", une association culturelle qui promeut l'art et la créativité.
Ton rôle est d'adapter le contenu d'une vidéo YouTube pour différentes plateformes tout en conservant l'essence du message.

Règles importantes :
- Garde le ton authentique et engageant
- Adapte la longueur selon les contraintes de chaque plateforme
- Utilise des emojis de manière pertinente mais pas excessive
- Inclus des appels à l'action appropriés
- Respecte l'identité de marque du Trousseau
- Génère du contenu en français
`
};

export const PLATFORM_PROMPTS = {
  TWITTER: {
    system: SYSTEM_PROMPTS.CONTENT_CREATOR,
    user: (videoData) => `
Voici les informations d'une vidéo YouTube que je viens de publier :

Titre : ${videoData.title}
Description : ${videoData.description}
Tags : ${videoData.tags?.join(', ') || 'Aucun'}
URL : ${videoData.url}

Génère un tweet engageant (maximum 280 caractères) qui :
1. Capte l'attention immédiatement
2. Résume l'essence de la vidéo
3. Incite au clic
4. Inclut 2-3 hashtags pertinents
5. Termine par l'URL de la vidéo

Format de réponse (JSON) :
{
  "text": "Le contenu du tweet avec emojis et hashtags",
  "hashtags": ["hashtag1", "hashtag2"],
  "callToAction": "Texte d'appel à l'action court"
}
`
  },

  INSTAGRAM: {
    system: SYSTEM_PROMPTS.CONTENT_CREATOR,
    user: (videoData) => `
Voici les informations d'une vidéo YouTube que je viens de publier :

Titre : ${videoData.title}
Description : ${videoData.description}
Tags : ${videoData.tags?.join(', ') || 'Aucun'}
URL : ${videoData.url}

Génère une légende Instagram engageante qui :
1. Commence par un hook accrocheur (première ligne)
2. Développe le sujet (2-3 paragraphes)
3. Inclut des emojis pertinents
4. Termine par un appel à l'action
5. Ajoute 10-15 hashtags pertinents à la fin
6. Maximum 2000 caractères

Format de réponse (JSON) :
{
  "caption": "La légende complète avec emojis",
  "hashtags": ["hashtag1", "hashtag2", ...],
  "firstComment": "Commentaire optionnel à ajouter"
}
`
  },

  INSTAGRAM_STORY: {
    system: SYSTEM_PROMPTS.CONTENT_CREATOR,
    user: (videoData) => `
Voici les informations d'une vidéo YouTube :

Titre : ${videoData.title}
Description courte : ${videoData.description?.substring(0, 200) || ''}

Génère du contenu pour une story Instagram qui :
1. Contient un texte court et percutant (2-3 lignes max)
2. Utilise des emojis appropriés
3. Incite à swiper up ou cliquer sur le lien
4. Reste simple et lisible sur mobile

Format de réponse (JSON) :
{
  "text": "Texte court pour la story",
  "sticker": "Type de sticker à utiliser (poll, question, countdown, etc.)",
  "callToAction": "Texte pour le bouton/swipe"
}
`
  },

  WEBSITE_ARTICLE: {
    system: SYSTEM_PROMPTS.CONTENT_CREATOR,
    user: (videoData) => `
Voici les informations d'une vidéo YouTube :

Titre : ${videoData.title}
Description : ${videoData.description}
Tags : ${videoData.tags?.join(', ') || 'Aucun'}
URL : ${videoData.url}

Génère un article de blog optimisé SEO qui :
1. Titre H1 accrocheur (différent du titre YouTube)
2. Introduction engageante (2-3 paragraphes)
3. Corps de l'article structuré avec H2/H3
4. Intègre naturellement la vidéo YouTube
5. Conclusion avec CTA
6. Meta description SEO (160 caractères max)
7. Suggestions de mots-clés

Format de réponse (JSON) :
{
  "title": "Titre de l'article",
  "metaDescription": "Meta description SEO",
  "introduction": "Paragraphe d'introduction",
  "body": "Corps de l'article en HTML avec balises H2, H3, p, etc.",
  "conclusion": "Paragraphe de conclusion",
  "keywords": ["mot-clé1", "mot-clé2", ...],
  "category": "Catégorie suggérée"
}
`
  },

  NEWSLETTER: {
    system: SYSTEM_PROMPTS.CONTENT_CREATOR,
    user: (videoData) => `
Voici les informations d'une vidéo YouTube :

Titre : ${videoData.title}
Description : ${videoData.description}
URL : ${videoData.url}

Génère le contenu d'un email newsletter qui :
1. Objet email accrocheur (max 50 caractères)
2. Preheader engageant (max 100 caractères)
3. Corps de l'email en HTML simple
4. Ton chaleureux et personnel
5. Inclut un CTA clair pour regarder la vidéo
6. Signature personnalisée

Format de réponse (JSON) :
{
  "subject": "Objet de l'email",
  "preheader": "Preheader",
  "body": "Corps de l'email en HTML",
  "cta": {
    "text": "Texte du bouton",
    "url": "URL de la vidéo"
  }
}
`
  }
};

/**
 * Get prompt for a specific platform
 * @param {string} platform - Platform name
 * @param {object} videoData - Video metadata
 * @returns {object} System and user prompts
 */
export function getPromptForPlatform(platform, videoData) {
  const prompt = PLATFORM_PROMPTS[platform];
  if (!prompt) {
    throw new Error(`No prompt template found for platform: ${platform}`);
  }

  return {
    system: prompt.system,
    user: prompt.user(videoData)
  };
}
