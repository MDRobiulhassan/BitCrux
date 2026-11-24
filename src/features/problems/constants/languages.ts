const LANGUAGE_IDS = {
  CPP: 54,
  JAVA: 62,
  PYTHON: 71,
} as const;

export type SupportedLanguage = keyof typeof LANGUAGE_IDS;

export function getJudge0LanguageId(language: string) {
  const normalizedLanguage = language.toUpperCase();

  if (!(normalizedLanguage in LANGUAGE_IDS)) {
    return undefined;
  }

  return LANGUAGE_IDS[normalizedLanguage as SupportedLanguage];
}
