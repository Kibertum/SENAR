# SENAR Changelog

## v1.3 (2026-03-25)
### Added (Core + Restructure)
- **SENAR Core 1.0** — standalone 8-rule document (EN + RU) for individual developers and small teams
- **Removed Essential configuration** — SENAR Core replaces Essential as the entry-level offering. Standard now defines only Team and Enterprise configurations (Section 11)
- **L2 renamed from "Self-Review" to "Verification Statement"** — L2 is not a review level; it is a structured verification statement by the person/agent who did the work (Section 10.15)
- **Dead End threshold defined** — >15 minutes without a usable result (Sections 3.11, 10.4)
- **Security review SHALL at all configurations** — for high-risk changes, mandatory at ALL levels (Sections 8.7, 10.15)
- **Conformance clause updated** — removed Essential; added SENAR Core clause (Section 13)
- **All Essential references removed** — replaced with "see SENAR Core"
- **Summary tables updated** — Team/Enterprise only
- **Migration path** — now starts from SENAR Core → Team → Enterprise

### Added
- **Rule 15: AI Output Quality Verification** — three verification levels (L1 Automated, L2 Self-Review, L3 Adversarial Review) with risk-based scoping (High/Standard/Low)
- **Metric 10: Adversarial Detection Rate (ADR)** — adversarial_critical_findings / L3-reviewed tasks
- **S5.5 Structured Tool Protocol** — protocol-agnostic requirement for agent-platform interaction (replaces vendor-specific MCP reference)
- **S5.6 Agent Dispatch and Execution Isolation** — risks, mandatory practices, canonical dispatch pattern
- **S5.7 Federation** — scaling SENAR across multiple projects: project independence, coordination, knowledge routing, federated metrics
- **Reference: Code Standards Template** — evidence-based template for organizational code standards
- **23-item AI Review Checklist** — expanded from 13 items with 3 priority tiers; items 14-23 cover latent defect patterns from adversarial audits
- 8 new term definitions (3.31-3.38): Adversarial Review, Agent Dispatch, Agent Profile, Structured Tool Protocol, Operational Script, Latent Defect, ADR, Code Standards
- KCR target calibration guidance (1.0 greenfield, 0.33 mature)
- No-epoch-filtering policy for metric computation
- Cost Predictability deferral guidance (Core: MAY defer, Team+: SHALL with provisional baselines)
- Multi-agent/multi-session metrics disclaimer
- ADR collection method in Section 9.3
- ADR in Increment Retrospective ceremony

### Changed
- **Rule 12 Context Hygiene** — upgraded from SHOULD to SHALL for credentials/PII at ALL configurations
- **QG-2** — "types clean" → "static analysis passes (including type checking where applicable)"
- **Stack neutrality** — removed all vendor/product names from normative text (Anthropic, OpenAI, Google, Claude, GPT, CouchDB)
- Section 5.5 Portability renumbered to 5.8
- Configuration counts updated: 15 rules (was 14), 10 metrics (was 9)
- Maturity model counts updated
- Rule 13 AI Model Governance — vendor-specific examples removed
- Section heading levels standardized across all files

### Fixed
- Cross-references in governance annex: corrected section numbers after v1.2 renumbering (7.x → 8.x, 9.x → 10.x)
- "Essential" references in governance → "Core/Foundation"
- Terminology: "checkpoints" → "quality gates" where referring to QG-0/QG-2
- Copyright: corrected to personal authors
- SSRF added to Verification Checklist (item 18, High tier)
- Prompt injection defense guidance (Section 5.5)
- Typosquatting and dependency confusion added to QG-2 criteria
- EU AI Act, NIST AI RMF, ISO/IEC 27001:2022 compliance mappings added
- GDPR DPA requirement strengthened (SHOULD → SHALL)
- Foundation role clarifications, QG-0 alignment, agent profile requirements
- FPSR measurement procedure, KB format guidance, Quality Sweep runbook
- Summary files updated to v1.3 content
- Stale monolithic files and old PDFs removed

## v1.2 (2026-03-23)
### Added
- **S5 Agent Instrumentation** — new section: control levels, agent profiles, script governance, programmatic interface, portability
- **Rule 14: Script Change Management** — version-controlled, reviewed, rollbackable
- **Guide: Agent Configuration in Practice** — new chapter with examples
- Context Architect role expanded: agent profile design, script management
- Tooling Requirements: agent configuration management section
- Changelog (this document)
- Site: mobile navigation, changelog page

### Changed
- Sections renumbered: S5->S6, S6->S7, ... S12->S13
- All cross-references updated

### Fixed
- Navigation 404 on Standard link
- Literary Russian improvements

## v1.1 (2026-03-22)
### Added
- Requirements hierarchy: BR -> SR -> TR
- QG-0 strengthened: requirement traceability
- QG-1: Requirements Gate (Team+ only)
- Rule 10: Requirement Traceability
- Rule 11: Code Documentation as Context
- Rule 12: Context Hygiene
- Rule 13: AI Model Governance
- Guide chapters: Quick Start, Requirements Engineering, Legacy Adoption, Worked Example, Tool Integration
- Conformance clause (self-declared, peer, audited)
- Enterprise roles (Portfolio Manager, Chief Supervisor)

## v1.0 (2026-03-21)
### Initial Release
- 12 sections, 5 roles, 5 units of work
- 7 procedures, 5 quality gates, 9 metrics, 11 rules
- 3 configurations: Essential, Team, Enterprise
- Guide: 6 chapters
- Reference: glossary, scaling, efficiency, governance, tooling
