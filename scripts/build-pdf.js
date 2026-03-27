const { mdToPdf } = require('md-to-pdf');
const fs = require('fs');
const path = require('path');

const STANDARD_FILES = [
  'standard/00-introduction.md',
  'standard/01-scope.md',
  'standard/02-normative-refs.md',
  'standard/03-terms.md',
  'standard/04-roles.md',
  'standard/05-agent-instrumentation.md',
  'standard/06-units-of-work.md',
  'standard/07-ceremonies.md',
  'standard/08-quality-gates.md',
  'standard/09-metrics.md',
  'standard/10-rules.md',
  'standard/11-configurations.md',
  'standard/12-maturity-model.md',
  'standard/13-conformance.md',
];

const GUIDE_FILES = [
  'guide/00-quickstart.md',
  'guide/01-philosophy.md',
  'guide/02-ai-review-checklist.md',
  'guide/03-walkthrough.md',
  'guide/04-transition-guide.md',
  'guide/05-safe-comparison.md',
  'guide/06-failure-modes.md',
  'guide/07-requirements.md',
  'guide/08-legacy-adoption.md',
  'guide/09-worked-example.md',
  'guide/10-tool-guides.md',
  'guide/11-agent-configuration.md',
];

const REFERENCE_FILES = [
  'reference/01-glossary.md',
  'reference/02-scaling-ratios.md',
  'reference/03-efficiency-model.md',
  'reference/04-governance-compliance.md',
  'reference/05-tooling-requirements.md',
  'reference/06-code-standards-template.md',
];

const CSS = `
  body {
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #1a1a1a;
    max-width: 100%;
  }
  h1 {
    font-size: 24pt;
    font-weight: 800;
    color: #1E3A5F;
    border-bottom: 3px solid #D4A843;
    padding-bottom: 8px;
    margin-top: 40px;
    page-break-before: always;
  }
  h1:first-child { page-break-before: avoid; }
  h2 {
    font-size: 16pt;
    font-weight: 700;
    color: #1E3A5F;
    border-bottom: 1px solid #E3EFF8;
    padding-bottom: 4px;
    margin-top: 30px;
    page-break-after: avoid;
  }
  h3 {
    font-size: 13pt;
    font-weight: 600;
    color: #2A4A73;
    margin-top: 20px;
    page-break-after: avoid;
  }
  blockquote {
    page-break-inside: avoid;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 10pt;
    page-break-inside: avoid;
  }
  th {
    background: #F2F7FC;
    padding: 6px 10px;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #B8D4EA;
  }
  td {
    padding: 5px 10px;
    border-bottom: 1px solid #E3EFF8;
  }
  code {
    background: #F2F7FC;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 9.5pt;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
  }
  pre {
    background: #0F1B2D;
    color: #E3EFF8;
    padding: 12px;
    border-radius: 6px;
    font-size: 9pt;
    overflow-x: auto;
    page-break-inside: avoid;
  }
  pre code { background: none; color: inherit; padding: 0; }
  blockquote {
    border-left: 4px solid #D4A843;
    padding-left: 12px;
    margin: 16px 0;
    font-style: italic;
    color: #2A4A73;
  }
  strong { font-weight: 700; }
  a { color: #3B6491; text-decoration: none; }
  hr { border: none; border-top: 2px solid #E3EFF8; margin: 30px 0; }

  .cover-page {
    text-align: center;
    padding-top: 200px;
    page-break-after: always;
  }
  .cover-page h1 {
    font-size: 48pt;
    border: none;
    color: #1E3A5F;
    page-break-before: avoid;
    margin-bottom: 10px;
  }
  .cover-page .subtitle {
    font-size: 16pt;
    color: #5A8AB5;
    margin-bottom: 40px;
  }
  .cover-page .meta {
    font-size: 11pt;
    color: #8BB3D4;
  }
  .toc { page-break-after: always; }
  .toc h2 { font-size: 20pt; border: none; }
  .toc ul { list-style: none; padding: 0; }
  .toc li { padding: 4px 0; border-bottom: 1px dotted #E3EFF8; }
  .toc a { color: #1E3A5F; font-weight: 500; }

  @page { margin: 2cm 2.5cm; }
  @page :first { margin-top: 0; }
`;

async function buildPdf(files, coverTitle, coverSubtitle, outputPath, tocItems) {
  const root = path.resolve(__dirname, '..');

  // Build cover page
  let md = `<div class="cover-page">

# SENAR

<div class="subtitle">${coverSubtitle}</div>

<div class="meta">

Version 1.3 | 25.03.2026

Authors: Andrey Yumashev, Vadim Soglaev

CC BY-SA 4.0 | senar.tech

</div>
</div>

<div class="toc">

## ${coverTitle === 'SENAR Standard + Guide + Reference' ? 'Table of Contents' : 'Содержание'}

`;

  // Build TOC
  for (const item of tocItems) {
    md += `- ${item}\n`;
  }
  md += '\n</div>\n\n';

  // Concatenate all files
  for (const file of files) {
    const filePath = path.join(root, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      md += content + '\n\n---\n\n';
    } else {
      console.warn(`WARNING: File not found: ${filePath}`);
    }
  }

  const pdf = await mdToPdf(
    { content: md },
    {
      css: CSS,
      pdf_options: {
        format: 'A4',
        printBackground: true,
        margin: { top: '2cm', bottom: '2cm', left: '2.5cm', right: '2.5cm' },
      },
      launch_options: { headless: true, args: ['--no-sandbox'] },
    }
  );

  if (pdf) {
    fs.writeFileSync(outputPath, pdf.content);
    console.log(`PDF generated: ${outputPath} (${Math.round(pdf.content.length / 1024)} KB)`);
  }
}

async function main() {
  const allFiles = [...STANDARD_FILES, ...GUIDE_FILES, ...REFERENCE_FILES];

  const tocEN = [
    '**STANDARD**',
    'Introduction', 'Scope', 'Normative References', 'Terms and Definitions',
    'Roles', 'Agent Instrumentation', 'Units of Work', 'Ceremonies', 'Quality Gates',
    'Metrics', 'Operational Rules', 'Configurations', 'Maturity Model', 'Conformance',
    '**GUIDE**',
    'Quick Start', 'Philosophy', 'AI Output Review Checklist', 'Walkthrough',
    'Transition Guide', 'SAFe Comparison', 'Failure Modes',
    'Requirements Engineering', 'Legacy Adoption', 'Worked Example', 'Tool Integration',
    'Agent Configuration',
    '**REFERENCE**',
    'Glossary', 'Scaling Ratios', 'Efficiency Model',
    'Governance & Compliance', 'Tooling Requirements', 'Code Standards Template',
  ];

  const outDir = path.resolve(__dirname, '..', 'site', 'public');

  await buildPdf(
    allFiles,
    'SENAR Standard + Guide + Reference',
    'Supervised Engineering & Normative AI Regulation',
    path.join(outDir, 'senar-v1.3-en.pdf'),
    tocEN
  );

  console.log('Done.');
}

main().catch(console.error);
