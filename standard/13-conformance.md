# 13. Conformance

## 13.1 Claiming Conformance

An organization claiming conformance to SENAR SHALL:

a) Identify the applicable configuration: Foundation, Team, or Enterprise (Section 11);
b) Implement all SHALL requirements of the applicable configuration;
c) Document any SHOULD requirements that are not implemented, with rationale;
d) Maintain evidence of implementation (audit records, metric data, task tracker records).

A conformance claim SHALL use the following format: "[Organization] conforms to SENAR v[version] [Configuration] configuration, [self-declared | peer-assessed | independently audited], as of [date]."

## 13.2 Conformance Levels

| Level | Description | Evidence |
|-------|------------|----------|
| **Self-declared** | Organization assesses itself against SENAR requirements | Internal assessment record |
| **Peer-assessed** | Assessment conducted by a SENAR practitioner from another organization | Peer assessment report |
| **Independently audited** | Assessment by a qualified auditor with SE process assessment experience | Formal audit report |

Organizations MAY claim any conformance level. Higher levels provide stronger evidence for stakeholders, clients, and regulators.

## 13.3 SENAR Core

Teams implementing SENAR Core are not required to conform to this Standard but are encouraged to adopt Foundation configuration when ready. SENAR Core conformance is declared separately per the SENAR Core document.

## 13.4 Partial Conformance

Organizations MAY claim partial conformance by specifying which sections they conform to (e.g., "SENAR Team conformant for Sections 6–9"). Partial conformance claims SHALL explicitly list the included sections.

Partial conformance claims SHALL include at minimum Sections 6 (Units of Work), 8 (Quality Gates), 9 (Metrics), and 10 (Operational Rules) — these constitute the irreducible core of SENAR practice. A claim covering only definitional sections (Sections 1–4) is not a valid partial conformance claim.

## 13.5 Non-Conformance Handling

When a SHALL requirement cannot be met, the organization SHALL document the non-conformance with: justification, risk acknowledgment, remediation plan, and approval by a role senior to the requestor. Non-conformance records are distinct from operational Gate Bypasses (Section 3.13) — they apply at the process level, not the task level.

## 13.6 Maintaining Conformance

Organizations claiming conformance SHOULD reassess at each Increment Retrospective (Section 7.7). Conformance claims SHOULD be re-evaluated after: major process changes, AI model generation changes (Section 10.13), or organizational scaling across configuration tiers.
