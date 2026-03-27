# SENAR Reference: Complete Glossary

Alphabetical listing of all SENAR terms. Core terms are defined normatively in SENAR Standard Section 3.

| Term | Definition |
|------|-----------|
| **AI Agent** | Software system powered by LLM that generates engineering artifacts under human direction |
| **AI Model Provider** | External service providing AI Agent capabilities (e.g., Anthropic, OpenAI, Google); de facto supplier (Standard 3.25) |
| **AI Model Version** | Specific version/generation of an AI model; metric baselines are version-dependent (Standard 3.26) |
| **Checkpoint** | Context preservation action during a Session |
| **Context** | Information provided to AI Agent: goal, AC, constraints, knowledge, traceability |
| **Context Architect** | Responsibility: designs requirements as structured AI input, manages traceability |
| **Cost per Task** | Metric: total cost / tasks done, segmented by complexity |
| **Cost Predictability** | Metric: actual cost / planned cost for an Increment |
| **Cycle Time** | Time from Task start to completion (started_at → completed_at) |
| **Dead End** | Documented failed approach with reason for abandonment |
| **Defect Escape Rate** | Metric: % defects found after Task marked done |
| **Delivery Review** | Ceremony: demonstrate software to stakeholders |
| **Exploration** | Time-bounded investigation without full Task formality |
| **Federation** | Coordination mechanism for multiple Supervisor+AI Pairs |
| **Federation Sync** | Ceremony: coordinate multiple Pairs on dependencies |
| **First-Pass Success Rate** | Metric: % Tasks completed correctly in one cycle |
| **Flow Manager** | Responsibility: session rhythm, cost tracking, flow metrics |
| **Gate Bypass** | Documented exception to proceed past a Quality Gate |
| **Increment** | Scope-bounded batch of work with objectives and budget |
| **Increment Planning** | Ceremony: define objectives, tasks, budget, risks |
| **Increment Retrospective** | Ceremony: quantitative review of Increment metrics |
| **Knowledge Capture Rate** | Metric: knowledge entries / tasks done |
| **Knowledge Engineer** | Responsibility: capture, curate, maintain knowledge base |
| **Knowledge Entry** | Documented decision, pattern, gotcha, or dead end |
| **Lead Time** | Time from Task creation to completion |
| **Manual Intervention Rate** | Metric: % Tasks with manual code writing |
| **Maturity Level** | Organization's SENAR adoption depth (L1–L5) |
| **Quality at Input** | Principle: defects in requirements cascade to all downstream artifacts; quality is built at input, not checked at output |
| **Quality Gate** | Automated enforcement point blocking work unless criteria met |
| **Quality Sweep** | Ceremony: periodic comprehensive codebase/KB audit |
| **Requirement** | Documented, verifiable statement of need at BR, SR, or TR level (Standard 3.17) |
| **Requirement — Business (BR)** | Stakeholder-level need in business terms; source of all downstream requirements (Standard 3.18) |
| **Requirement — System (SR)** | System-level capability derived from BR; what the system must do (Standard 3.19) |
| **Requirement — Task (TR)** | Implementation-level requirement = Task goal + acceptance criteria (Standard 3.20) |
| **Requirement Hierarchy** | Decomposition chain: BR → SR → TR; depth scales by complexity (Standard 3.21) |
| **Requirement Library** | Managed repository of verified, reusable requirements stored in Knowledge Base (Team+) |
| **Requirement Pattern** | Reusable AC template for common task types (CRUD, migration, UI, integration) |
| **Session** | Time-bounded period of supervised AI work |
| **Session End** | Ceremony: capture metrics, write handoff, record knowledge |
| **Session Start** | Ceremony: load context, select tasks, verify environment |
| **Story** | Intermediate grouping of Tasks as stakeholder-visible deliverable |
| **Supervisor** | Human who directs AI agents, verifies output, enforces gates |
| **Supervisor+AI Pair** | Fundamental production unit: one Supervisor + AI Agent(s) |
| **Task** | Atomic unit of tracked work with goal and acceptance criteria |
| **Throughput** | Metric: tasks completed per Session |
| **Traceability** | Bidirectional linking: every TR → BR upward; every BR → TR(s) downward (Standard 3.24) |
| **Value Stream** | End-to-end flow from client request to delivered software |
| **Verification Engineer** | Responsibility: audits AI output for correctness and security |
| **Work Type** | Functional category of a Task (dev, arch, QA, docs) |
| **WSJF** | Prioritization: Cost of Delay / Job Size (from SAFe) |
