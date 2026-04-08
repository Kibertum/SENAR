export const languages = {
  en: 'English',
  ru: 'Русский',
} as const;

export type Lang = keyof typeof languages;

export const ui = {
  en: {
    'site.title': 'SENAR — Supervised Engineering & Normative AI Regulation',
    'site.description': 'The first formalized methodology for AI-native software development. Defines how human Supervisors manage AI agents to produce verified, traceable software.',
    'nav.home': 'Home',
    'nav.core': 'Core',
    'nav.standard': 'Standard',
    'nav.guide': 'Guide',
    'nav.reference': 'Reference',
    'nav.search': 'Search',
    'hero.tagline': 'The first methodology for AI-native software development',
    'hero.subtitle': 'When AI writes the code, what do humans do — and how?',
    'hero.cta.standard': 'Read the Standard',
    'hero.cta.mvs': 'Start with MVS',
    'mvs.title': 'Minimum Viable SENAR',
    'mvs.subtitle': 'You are practicing SENAR when these six things are true:',
    'values.title': 'Values',
    'footer.license': 'CC BY-SA 4.0',
    'footer.authors': 'Andrey Yumashev, Vadim Soglaev',
    'standard.toc': 'Table of Contents',
    'standard.prev': 'Previous',
    'standard.next': 'Next',
  },
  ru: {
    'site.title': 'SENAR — Supervised Engineering & Normative AI Regulation',
    'site.description': 'Первая формализованная методология для AI-нативной разработки ПО. Определяет, как Супервизоры управляют AI-агентами для производства верифицированного ПО.',
    'nav.home': 'Главная',
    'nav.core': 'Основы',
    'nav.standard': 'Стандарт',
    'nav.guide': 'Руководство',
    'nav.reference': 'Справочник',
    'nav.search': 'Поиск',
    'hero.tagline': 'Первая методология для AI-нативной разработки',
    'hero.subtitle': 'Когда AI пишет код — что делают люди и как?',
    'hero.cta.standard': 'Читать стандарт',
    'hero.cta.mvs': 'Начать с MVS',
    'mvs.title': 'Минимальный SENAR',
    'mvs.subtitle': 'Вы практикуете SENAR, когда выполняются эти шесть условий:',
    'values.title': 'Ценности',
    'footer.license': 'CC BY-SA 4.0',
    'footer.authors': 'Андрей Юмашев, Вадим Соглаев',
    'standard.toc': 'Содержание',
    'standard.prev': 'Назад',
    'standard.next': 'Далее',
  },
} as const;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'ru') return 'ru';
  return 'en';
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui.en): string {
    return ui[lang][key] || ui.en[key];
  };
}

export function getLocalizedPath(path: string, lang: Lang): string {
  return `/${lang}${path}`;
}
