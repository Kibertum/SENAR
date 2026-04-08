# SENAR

## Supervised Engineering & Normative AI Regulation

**Version:** 1.3 | **Date:** 25.03.2026
**Authors:** Андрей Юмашев (Andrey Yumashev), Вадим Соглаев (Vadim Soglaev)
**License:** CC BY-SA 4.0 | **Website:** senar.tech

---

> **NOTE:** The following summary is informative. Normative requirements are defined in Sections 4–13.

## Start Here: Minimum Viable SENAR (MVS)

You are practicing SENAR when these six things are true:

1. **Every AI implementation has a Task** with a goal and acceptance criteria — before work begins.
2. **AI output is verified** by a Supervisor against acceptance criteria — never rubber-stamped.
3. **Tasks cannot start** without goal, acceptance criteria, and requirement link (Context Gate).
4. **Tasks cannot close** unless CI passes, tests pass, and types are clean (Implementation Gate).
5. **Throughput and Lead Time are measured** — you know how many tasks per session and how long they take.
6. **Dead Ends are documented** — when an approach fails, you write down why, so no one repeats it.

That's it. Do these six things and you are practicing the core of SENAR. For a structured entry point, see SENAR Core (8 rules, 2 gates, 2 metrics). Everything else in this standard builds on this foundation.

---

## What Is SENAR

SENAR is a methodology for software development where AI agents are the primary producers of engineering artifacts and humans serve as Supervisors — directing, verifying, and governing AI output.

SENAR addresses a fundamental shift in software engineering: when AI produces the code, the human's value moves from **production** (writing code) to **judgment** (designing context, verifying correctness, making architectural decisions).

Existing methodologies (Scrum, SAFe, Kanban) were designed for teams of humans coordinating with each other. SENAR is designed for Supervisor+AI Pairs producing verified, traceable software.

## SENAR Values

1. **Context over Code** — AI output quality is determined by input context quality
2. **Verification over Speed** — correctness is the constraint, not velocity
3. **Knowledge over Experience** — what is not documented does not exist for AI
4. **Enforcement over Agreement** — quality standards enforced through automated gates, not meetings
5. **Judgment over Keystrokes** — human attention on decisions and verification, not on typing

## SENAR Core

SENAR Core provides 8 foundational rules for any team. This Standard extends Core with organizational processes, metrics, and governance. Teams adopting SENAR for the first time SHOULD start with SENAR Core. Teams implementing SENAR Core are not required to conform to this Standard but are encouraged to adopt Foundation configuration when ready.

## Document Set

| Document | Purpose | Audience |
|----------|---------|----------|
| **SENAR Core** | 8 foundational rules — entry-level adoption | Any team, individual Supervisors |
| **SENAR Standard** (this document) | Normative requirements (SHALL/SHOULD/MAY) | Organizations, auditors |
| **SENAR Guide** | Philosophy, interaction patterns, training | Supervisors, adopters |
| **SENAR Reference** | Glossary, scaling ratios, economic model, compliance, tooling | Managers, compliance |

## Normative Language

Per RFC 2119: **SHALL** = required, **SHOULD** = recommended, **MAY** = optional.

Normative requirements appear in Sections 4–13 of this Standard. The Guide and Reference are informative.

## Tooling

SENAR is tool-agnostic in choice but tool-dependent in practice. Automated quality gates, metric collection, and knowledge management require tooling support. See SENAR Reference (Tooling Requirements) for detailed capability requirements.

## AI Capability Dependence

Some SENAR provisions are capability-dependent: they reference AI behavioral patterns (hallucination types, context window limits, instruction following characteristics) that change with model generations. Organizations SHOULD review capability-dependent provisions when the AI model they use changes substantially (see Section 10.13). The SENAR Guide marks such provisions explicitly.

## Empirical Basis and Limitations

SENAR's quantitative guidance (metric baselines, session duration guidelines, cost estimates) is derived from a single reference implementation: 552 tasks, $989 in AI costs, 38 sessions across 6 microservices. This constitutes a case study, not a controlled experiment. Organizations should treat these numbers as illustrative starting points, not universal targets — which is why Section 9 requires establishing your own baselines before setting targets.

Specific limitations: N=1 organization, self-reported metrics, pre/post design without control group, single AI model family. Independent replication across different organizations, domains, and AI models is needed to validate generalizability.

## Intellectual Heritage

SENAR builds on established software engineering foundations: requirements engineering (IEEE 29148), quality cost models (Boehm, 1981), process maturity (CMMI/SEI), flow metrics (DORA, Accelerate), lean manufacturing quality practices (First Pass Yield, Right First Time), and human-AI teaming research. SENAR's contribution is the specific application and codification of these principles for AI-native development — where AI agents are the primary code producers and human engineers serve as Supervisors. The methodology does not claim to invent quality engineering; it claims to adapt it for a production model that did not exist when prior frameworks were created.

## Versioning

Changes to normative requirements in the Standard are published as numbered versions (1.0, 1.1, 2.0). Guide and Reference materials may be updated between Standard versions. The changelog is maintained at senar.tech.
