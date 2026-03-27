const { mdToPdf } = require('md-to-pdf');
const fs = require('fs');
const path = require('path');

const RU_CONTENT = 'site/src/content';

const FILES = [
  `${RU_CONTENT}/core/ru/00-senar-core.md`,
  `${RU_CONTENT}/standard/ru/00-introduction.md`,
  `${RU_CONTENT}/standard/ru/01-scope.md`,
  `${RU_CONTENT}/standard/ru/02-normative-refs.md`,
  `${RU_CONTENT}/standard/ru/03-terms.md`,
  `${RU_CONTENT}/standard/ru/04-roles.md`,
  `${RU_CONTENT}/standard/ru/05-agent-instrumentation.md`,
  `${RU_CONTENT}/standard/ru/06-units-of-work.md`,
  `${RU_CONTENT}/standard/ru/07-ceremonies.md`,
  `${RU_CONTENT}/standard/ru/08-quality-gates.md`,
  `${RU_CONTENT}/standard/ru/09-metrics.md`,
  `${RU_CONTENT}/standard/ru/10-rules.md`,
  `${RU_CONTENT}/standard/ru/11-configurations.md`,
  `${RU_CONTENT}/standard/ru/12-maturity-model.md`,
  `${RU_CONTENT}/standard/ru/13-conformance.md`,
  `${RU_CONTENT}/guide/ru/00-quickstart.md`,
  `${RU_CONTENT}/guide/ru/01-philosophy.md`,
  `${RU_CONTENT}/guide/ru/02-ai-review-checklist.md`,
  `${RU_CONTENT}/guide/ru/03-walkthrough.md`,
  `${RU_CONTENT}/guide/ru/04-transition-guide.md`,
  `${RU_CONTENT}/guide/ru/05-safe-comparison.md`,
  `${RU_CONTENT}/guide/ru/06-failure-modes.md`,
  `${RU_CONTENT}/guide/ru/07-requirements.md`,
  `${RU_CONTENT}/guide/ru/08-legacy-adoption.md`,
  `${RU_CONTENT}/guide/ru/09-worked-example.md`,
  `${RU_CONTENT}/guide/ru/10-tool-guides.md`,
  `${RU_CONTENT}/guide/ru/11-agent-configuration.md`,
  `${RU_CONTENT}/guide/ru/12-onboarding.md`,
  `${RU_CONTENT}/reference/ru/01-glossary.md`,
  `${RU_CONTENT}/reference/ru/02-scaling-ratios.md`,
  `${RU_CONTENT}/reference/ru/03-efficiency-model.md`,
  `${RU_CONTENT}/reference/ru/04-governance-compliance.md`,
  `${RU_CONTENT}/reference/ru/05-tooling-requirements.md`,
];

const CSS = `
  body { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; font-size: 11pt; line-height: 1.6; color: #1a1a1a; }
  h1 { font-size: 24pt; font-weight: 800; color: #1E3A5F; border-bottom: 3px solid #D4A843; padding-bottom: 8px; margin-top: 40px; page-break-before: always; }
  h1:first-child { page-break-before: avoid; }
  h2 { font-size: 16pt; font-weight: 700; color: #1E3A5F; border-bottom: 1px solid #E3EFF8; padding-bottom: 4px; margin-top: 30px; }
  h3 { font-size: 13pt; font-weight: 600; color: #2A4A73; margin-top: 20px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 10pt; }
  th { background: #F2F7FC; padding: 6px 10px; text-align: left; font-weight: 600; border-bottom: 2px solid #B8D4EA; }
  td { padding: 5px 10px; border-bottom: 1px solid #E3EFF8; }
  code { background: #F2F7FC; padding: 1px 4px; border-radius: 3px; font-size: 9.5pt; font-family: 'JetBrains Mono', monospace; }
  pre { background: #0F1B2D; color: #E3EFF8; padding: 12px; border-radius: 6px; font-size: 9pt; }
  pre code { background: none; color: inherit; padding: 0; }
  blockquote { border-left: 4px solid #D4A843; padding-left: 12px; margin: 16px 0; font-style: italic; color: #2A4A73; }
  strong { font-weight: 700; }
  a { color: #3B6491; text-decoration: none; }
  .cover { text-align: center; padding-top: 200px; page-break-after: always; }
  .cover h1 { font-size: 48pt; border: none; color: #1E3A5F; page-break-before: avoid; margin-bottom: 10px; }
  .cover .sub { font-size: 16pt; color: #5A8AB5; margin-bottom: 40px; }
  .cover .meta { font-size: 11pt; color: #8BB3D4; }
  @page { margin: 2cm 2.5cm; }
`;

async function main() {
  const root = path.resolve(__dirname, '..');

  let md = `<div class="cover">

# SENAR

<div class="sub">Supervised Engineering & Normative AI Regulation</div>

<div class="meta">

Версия 1.3 | 25.03.2026

Авторы: Андрей Юмашев, Вадим Соглаев

CC BY-SA 4.0 | senar.tech

</div>
</div>

`;

  for (const file of FILES) {
    const fp = path.join(root, file);
    if (fs.existsSync(fp)) {
      md += fs.readFileSync(fp, 'utf-8') + '\n\n---\n\n';
    } else {
      console.warn('MISSING:', fp);
    }
  }

  const pdf = await mdToPdf(
    { content: md },
    {
      css: CSS,
      pdf_options: { format: 'A4', printBackground: true, margin: { top: '2cm', bottom: '2cm', left: '2.5cm', right: '2.5cm' } },
      launch_options: { headless: true, args: ['--no-sandbox'] },
    }
  );

  if (pdf) {
    const out = path.join(root, 'site', 'public', 'senar-v1.3-ru.pdf');
    fs.writeFileSync(out, pdf.content);
    console.log(`PDF: ${out} (${Math.round(pdf.content.length / 1024)} KB)`);
  }
}

main().catch(console.error);
