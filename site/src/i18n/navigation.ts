import type { Lang } from './ui';

export interface NavItem {
  slug: string;
  file: string;
  title: Record<Lang, string>;
  pageTitle?: Record<Lang, string>;
}

export const coreSections: NavItem[] = [
  { slug: 'senar-core', file: '00-senar-core', title: { en: 'SENAR Core', ru: 'Основы SENAR' }, pageTitle: { en: 'SENAR Core: 8 Rules for AI Development | SENAR', ru: 'Основы SENAR: 8 правил AI-разработки | SENAR' } },
];

export const standardSections: NavItem[] = [
  { slug: 'introduction', file: '00-introduction', title: { en: 'Introduction', ru: 'Введение' }, pageTitle: { en: 'Introduction to the Standard', ru: 'Введение в стандарт' } },
  { slug: 'scope', file: '01-scope', title: { en: 'Scope', ru: 'Область применения' }, pageTitle: { en: 'Scope & Applicability', ru: 'Область применения' } },
  { slug: 'references', file: '02-normative-refs', title: { en: 'References', ru: 'Ссылки' }, pageTitle: { en: 'Normative References', ru: 'Нормативные ссылки' } },
  { slug: 'terms', file: '03-terms', title: { en: 'Terms', ru: 'Термины' }, pageTitle: { en: 'Terms & Definitions', ru: 'Термины и определения' } },
  { slug: 'roles', file: '04-roles', title: { en: 'Roles', ru: 'Роли' }, pageTitle: { en: 'Roles in AI-Native Development', ru: 'Роли в AI-нативной разработке' } },
  { slug: 'agent-instrumentation', file: '05-agent-instrumentation', title: { en: 'Agent Instrumentation', ru: 'Инструментарий агента' }, pageTitle: { en: 'Agent Instrumentation', ru: 'Инструментирование агентов' } },
  { slug: 'units-of-work', file: '06-units-of-work', title: { en: 'Units of Work', ru: 'Единицы работы' }, pageTitle: { en: 'Units of Work', ru: 'Единицы работы' } },
  { slug: 'ceremonies', file: '07-ceremonies', title: { en: 'Ceremonies', ru: 'Регламенты' }, pageTitle: { en: 'Ceremonies', ru: 'Церемонии' } },
  { slug: 'quality-gates', file: '08-quality-gates', title: { en: 'Quality Gates', ru: 'Контрольные точки качества' }, pageTitle: { en: 'Quality Gates (QG-0 to QG-4)', ru: 'Шлюзы качества (QG-0 — QG-4)' } },
  { slug: 'metrics', file: '09-metrics', title: { en: 'Metrics', ru: 'Метрики' }, pageTitle: { en: '10 Metrics for AI Development', ru: '10 метрик AI-разработки' } },
  { slug: 'rules', file: '10-rules', title: { en: 'Rules', ru: 'Правила' }, pageTitle: { en: '15 Rules for AI-Assisted Development', ru: '15 правил AI-разработки' } },
  { slug: 'configurations', file: '11-configurations', title: { en: 'Configurations', ru: 'Конфигурации' }, pageTitle: { en: 'Configurations: Core to Enterprise', ru: 'Конфигурации: от Базовой до Корпоративной' } },
  { slug: 'maturity', file: '12-maturity-model', title: { en: 'Maturity Model', ru: 'Модель зрелости' }, pageTitle: { en: 'Maturity Model', ru: 'Модель зрелости' } },
  { slug: 'conformance', file: '13-conformance', title: { en: 'Conformance', ru: 'Соответствие' }, pageTitle: { en: 'Conformance', ru: 'Соответствие' } },
];

export const guideSections: NavItem[] = [
  { slug: 'quickstart', file: '00-quickstart', title: { en: 'Quick Start', ru: 'Быстрый старт' }, pageTitle: { en: 'Quick Start: 5 Minutes to Better AI Development', ru: 'Быстрый старт за 5 минут' } },
  { slug: 'philosophy', file: '01-philosophy', title: { en: 'Philosophy', ru: 'Философия' }, pageTitle: { en: 'Philosophy: Context over Code', ru: 'Философия: контекст важнее кода' } },
  { slug: 'ai-review-checklist', file: '02-ai-review-checklist', title: { en: 'AI Review Checklist', ru: 'Чеклист проверки AI' }, pageTitle: { en: 'AI Output Review Checklist (28 items)', ru: 'Чеклист верификации AI (28 пунктов)' } },
  { slug: 'walkthrough', file: '03-walkthrough', title: { en: 'Walkthrough', ru: 'Пошаговый пример' }, pageTitle: { en: 'Walkthrough: Your First SENAR Task', ru: 'Пошаговый пример: первая задача по SENAR' } },
  { slug: 'transition', file: '04-transition-guide', title: { en: 'Transition Guide', ru: 'Руководство по переходу' }, pageTitle: { en: 'Transition Guide: Core to Standard', ru: 'Руководство по переходу: от Core к Standard' } },
  { slug: 'safe-comparison', file: '05-safe-comparison', title: { en: 'SAFe Comparison', ru: 'Сравнение с SAFe' }, pageTitle: { en: 'SAFe Comparison', ru: 'Сравнение с SAFe' } },
  { slug: 'failure-modes', file: '06-failure-modes', title: { en: 'Failure Modes', ru: 'Режимы отказа' }, pageTitle: { en: 'Failure Modes', ru: 'Режимы отказа' } },
  { slug: 'requirements', file: '07-requirements', title: { en: 'Requirements Engineering', ru: 'Инженерия требований' }, pageTitle: { en: 'Requirements Engineering', ru: 'Инженерия требований' } },
  { slug: 'legacy-adoption', file: '08-legacy-adoption', title: { en: 'Legacy Adoption', ru: 'Внедрение в legacy' }, pageTitle: { en: 'Legacy Adoption', ru: 'Внедрение в legacy-проекты' } },
  { slug: 'worked-example', file: '09-worked-example', title: { en: 'Worked Example', ru: 'Практический пример' }, pageTitle: { en: 'Worked Example with Code', ru: 'Практический пример с кодом' } },
  { slug: 'tool-guides', file: '10-tool-guides', title: { en: 'Tool Integration', ru: 'Интеграция с инструментами' }, pageTitle: { en: 'Tool Integration', ru: 'Интеграция с инструментами' } },
  { slug: 'agent-configuration', file: '11-agent-configuration', title: { en: 'Agent Configuration', ru: 'Настройка агента' }, pageTitle: { en: 'Agent Configuration in Practice', ru: 'Настройка агента на практике' } },
  { slug: 'onboarding', file: '12-onboarding', title: { en: 'Onboarding', ru: 'Онбординг' }, pageTitle: { en: 'Onboarding', ru: 'Онбординг' } },
];

export const referenceSections: NavItem[] = [
  { slug: 'glossary', file: '01-glossary', title: { en: 'Glossary', ru: 'Глоссарий' }, pageTitle: { en: 'Glossary', ru: 'Глоссарий' } },
  { slug: 'scaling', file: '02-scaling-ratios', title: { en: 'Scaling Ratios', ru: 'Коэффициенты масштабирования' }, pageTitle: { en: 'Scaling Ratios', ru: 'Коэффициенты масштабирования' } },
  { slug: 'efficiency', file: '03-efficiency-model', title: { en: 'Efficiency Model', ru: 'Модель эффективности' }, pageTitle: { en: 'Efficiency Model', ru: 'Модель эффективности' } },
  { slug: 'governance', file: '04-governance-compliance', title: { en: 'Governance & Compliance', ru: 'Управление и соответствие' }, pageTitle: { en: 'Governance & Compliance', ru: 'Управление и соответствие' } },
  { slug: 'tooling', file: '05-tooling-requirements', title: { en: 'Tooling Requirements', ru: 'Требования к инструментарию' }, pageTitle: { en: 'Tooling Requirements', ru: 'Требования к инструментарию' } },
  { slug: 'code-standards', file: '06-code-standards-template', title: { en: 'Code Standards Template', ru: 'Шаблон стандартов кода' }, pageTitle: { en: 'Code Standards Template', ru: 'Шаблон стандартов кода' } },
];

export function getNavItems(sections: NavItem[], lang: Lang, basePath: string) {
  return sections.map((s) => ({
    slug: s.slug,
    title: s.title[lang],
    href: `/${lang}/${basePath}/${s.slug}/`,
  }));
}

export function getPrevNext(sections: NavItem[], currentSlug: string, lang: Lang, basePath: string) {
  const idx = sections.findIndex((s) => s.slug === currentSlug);
  const prev = idx > 0 ? { title: sections[idx - 1].title[lang], href: `/${lang}/${basePath}/${sections[idx - 1].slug}/` } : null;
  const next = idx < sections.length - 1 ? { title: sections[idx + 1].title[lang], href: `/${lang}/${basePath}/${sections[idx + 1].slug}/` } : null;
  return { prev, next };
}
