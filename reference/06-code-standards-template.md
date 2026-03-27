# SENAR Reference: Code Standards Template

> Organizations SHOULD maintain a Code Standards document loaded into every AI agent's context (Rule 15, L2). This template provides a starting point derived from adversarial audits of production AI-generated code.

## How to Use

1. Copy this template to your project's agent configuration (e.g., `.claude/references/code-standards.md`)
2. Adapt rules to your stack (Python, TypeScript, Go, etc.)
3. Add project-specific conventions
4. Ensure the document is loaded into every agent session automatically

## Template Sections

A Code Standards document SHOULD cover:

| Section | What to Define | Example Rules |
|---------|---------------|---------------|
| Security | Input validation, access control, header trust, injection prevention | Never trust HTTP headers for security decisions without proxy validation |
| Architecture | File/function size limits, SRP, dependency injection | Max 400 lines/file, max 50 lines/function |
| Database | Query safety, migration patterns, bounded queries | Always use parameterized queries; always set LIMIT |
| API | Auth checks, schema validation, error handling | Every endpoint: verify auth AND resource access |
| Concurrency | Thread safety, resource lifecycle, data immutability | Shared mutable state requires locks |
| Domain-specific | LLM output validation, event processing, etc. | Validate LLM output before downstream use |
| Testing | Regression tests, mock boundaries, assertion quality | Every fix MUST include a regression test |
| Configuration | Startup validation, secure defaults | Fail fast if security config is missing |

## Key Principle

Every rule in a Code Standards document SHOULD be traceable to a real defect. Theoretical rules are ignored; evidence-based rules are followed.

See SENAR Guide Chapter 2 (AI Output Review Checklist) for complementary runtime checks.
