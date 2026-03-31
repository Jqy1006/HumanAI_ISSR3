// ---------------------------------------------------------------------------
// i18n — Internationalization Stub
//
// This module provides a lightweight i18n framework for future multi-language
// support.  Currently only English is included.
//
// How to add a new language:
//   1. Add the locale key to the Locale type below
//   2. Create a new translation record (copy TRANSLATIONS_EN and translate)
//   3. Add it to the TRANSLATIONS map
//   4. Add a language selector UI component that sets the active locale
//   5. Use  t("key")  in all UI text instead of hardcoded strings
// ---------------------------------------------------------------------------

export type Locale = "en" | "zh" | "es" | "de" | "fr" | "ja";

export interface TranslationKeys {
  // Landing page
  "landing.title": string;
  "landing.subtitle": string;
  "landing.startTask": string;
  "landing.downloadJson": string;
  "landing.downloadCsv": string;

  // Task page
  "task.title": string;
  "task.scenario": string;
  "task.accept": string;
  "task.override": string;
  "task.accuracyLabel": string;

  // Ratings page
  "ratings.title": string;
  "ratings.trustQuestion": string;
  "ratings.confidenceQuestion": string;
  "ratings.submit": string;
  "ratings.likert1": string;
  "ratings.likert4": string;
  "ratings.likert7": string;

  // Thanks page
  "thanks.title": string;
  "thanks.subtitle": string;
  "thanks.runAgain": string;
}

// ── English translations (default) ──────────────────────────────────────

const TRANSLATIONS_EN: TranslationKeys = {
  "landing.title": "Humanlike AI Systems and Trust Attribution",
  "landing.subtitle":
    "This prototype assigns a participant to one of two interface conditions and records whether the participant accepts or overrides an AI recommendation.",
  "landing.startTask": "Start Task",
  "landing.downloadJson": "Download JSON Logs",
  "landing.downloadCsv": "Download CSV Logs",

  "task.title": "Decision Task",
  "task.scenario":
    "Imagine you are selecting a laptop for a student data-analysis course. Below are the two options.",
  "task.accept": "Accept Recommendation",
  "task.override": "Override Recommendation",
  "task.accuracyLabel": "Stated accuracy rate",

  "ratings.title": "Rate Your Experience",
  "ratings.trustQuestion": "How much do you trust the recommendation from",
  "ratings.confidenceQuestion":
    "How confident are you in the decision you just made?",
  "ratings.submit": "Submit Ratings",
  "ratings.likert1": "1 — Strongly disagree",
  "ratings.likert4": "4 — Neutral",
  "ratings.likert7": "7 — Strongly agree",

  "thanks.title": "Thank you",
  "thanks.subtitle":
    "Your decision and ratings have been logged in both JSON and CSV format.",
  "thanks.runAgain": "Run Again"
};

// ── Translation registry ────────────────────────────────────────────────

const TRANSLATIONS: Record<Locale, TranslationKeys> = {
  en: TRANSLATIONS_EN,
  // Future: add zh, es, de, fr, ja translations here
  zh: TRANSLATIONS_EN,  // placeholder
  es: TRANSLATIONS_EN,  // placeholder
  de: TRANSLATIONS_EN,  // placeholder
  fr: TRANSLATIONS_EN,  // placeholder
  ja: TRANSLATIONS_EN   // placeholder
};

// ── Active locale (default: English) ────────────────────────────────────

let activeLocale: Locale = "en";

export function setLocale(locale: Locale): void {
  activeLocale = locale;
}

export function getLocale(): Locale {
  return activeLocale;
}

/**
 * Translate a key to the current locale.
 * Usage:  t("task.accept")  → "Accept Recommendation"
 */
export function t(key: keyof TranslationKeys): string {
  return TRANSLATIONS[activeLocale]?.[key] ?? TRANSLATIONS["en"][key] ?? key;
}
