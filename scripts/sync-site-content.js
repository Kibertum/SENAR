#!/usr/bin/env node
/**
 * Sync site content from repo root (source of truth).
 *
 * Repo structure:     standard/*.md, standard/ru/*.md
 * Site structure:     site/src/content/standard/en/*.md, site/src/content/standard/ru/*.md
 *
 * This script copies content from repo root to site/src/content/,
 * mapping root-level EN files into en/ subdirectories.
 *
 * Run: node scripts/sync-site-content.js
 * Auto-runs before: npm run dev, npm run build (via package.json)
 */

import { cpSync, mkdirSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const site = join(root, "site", "src", "content");

const sections = ["standard", "guide", "reference"];

for (const section of sections) {
  const src = join(root, section);

  // EN: root-level .md files → site/src/content/{section}/en/
  const enTarget = join(site, section, "en");
  mkdirSync(enTarget, { recursive: true });
  for (const f of readdirSync(src)) {
    if (f.endsWith(".md")) {
      cpSync(join(src, f), join(enTarget, f));
    }
  }

  // RU: {section}/ru/*.md → site/src/content/{section}/ru/
  const ruSrc = join(src, "ru");
  const ruTarget = join(site, section, "ru");
  mkdirSync(ruTarget, { recursive: true });
  try {
    for (const f of readdirSync(ruSrc)) {
      if (f.endsWith(".md")) {
        cpSync(join(ruSrc, f), join(ruTarget, f));
      }
    }
  } catch { /* no ru/ dir yet */ }
}

// Core: special case — core/en/*, core/ru/* → site/src/content/core/en/*, core/ru/*
for (const lang of ["en", "ru"]) {
  const coreSrc = join(root, "core", lang);
  const coreTarget = join(site, "core", lang);
  mkdirSync(coreTarget, { recursive: true });
  for (const f of readdirSync(coreSrc)) {
    if (f.endsWith(".md")) {
      // Site uses 00-senar-core.md naming
      const targetName = f === "senar-core.md" ? "00-senar-core.md" : f;
      cpSync(join(coreSrc, f), join(coreTarget, targetName));
    }
  }
}

console.log("Content synced from repo root → site/src/content/");
