# SENAR Guide: SAFe Comparison

SENAR is a standalone methodology inspired by SAFe concepts, designed for AI-native teams. Organizations using SAFe for human-led teams can adopt SENAR for AI-native workstreams, planning for coexistence rather than overlay.

## Key Differences

| Aspect | SAFe | SENAR | Why Different |
|--------|------|-------|---------------|
| Production unit | Team (5-9 people) | Supervisor+AI Pair | AI replaces the team as producer |
| Delivery metric | Velocity (SP/sprint) | Throughput (tasks/session) | AI throughput is unpredictable; SP estimation adds overhead |
| Time unit | Sprint (2 weeks) | Session (hours) | AI works in bursts, not rhythms |
| Planning | PI Planning (2 days, full ART) | Increment Planning (1 session) | No multi-team synchronization needed |
| Quality mechanism | DoR/DoD (team agreements) | Quality Gates (automated code) | AI doesn't feel accountability |
| Knowledge | CoP, wiki, tribal knowledge | Explicit knowledge base (mandatory) | AI has no long-term memory |
| Retrospective | Qualitative (feelings + data) | Quantitative (metrics only) | AI work produces precise measurements |
| Coordination | Scrum of Scrums, ART Sync | Federation Sync | Programmatic dependency tracking |
| Scaling | Essential → Full → Portfolio SAFe | Core → Team → Enterprise SENAR | Same concept, different production model |

## Role Mapping

| SAFe Role | SENAR Equivalent | Key Difference |
|-----------|-----------------|----------------|
| Developer | Supervisor | Supervisor directs AI; doesn't write code as primary activity |
| Product Owner | Context Architect (partial) | CA designs context for AI, not backlog for humans. Business value is shared with Flow Manager |
| Scrum Master | Flow Manager | FM manages rhythm and cost, not team dynamics. Servant leadership less relevant with AI |
| QA | Verification Engineer | VE writes acceptance criteria (AI writes tests). Focus shifts to AI-specific defect patterns |
| RTE | Flow Manager (at Enterprise) | Enterprise FM coordinates multiple Pairs like RTE coordinates teams |
| System Architect | Chief Supervisor (Enterprise) | Architectural governance across all Pairs |

## What SAFe Has That SENAR Doesn't

| SAFe Element | SENAR Approach |
|-------------|----------------|
| Communities of Practice | Knowledge base replaces human-to-human knowledge sharing with machine-readable entries |
| Architectural Runway | Knowledge Persistence + Dead End documentation serve similar purpose |
| IP Iteration | Innovation time recommended in Increment Retrospective |
| Built-In Quality | Quality Gates (stronger enforcement) |
| Solution Train / Large Solution | Enterprise configuration with Federation Coordinators (less developed) |

## Migration from SAFe to SENAR

Organizations moving AI workstreams from SAFe to SENAR should:

1. Start with SENAR Core on one Pair — validate minimum viable process
2. Run SAFe and SENAR in parallel for human-led and AI-led workstreams
3. Track both sets of metrics; compare delivery and quality
4. Expand SENAR to Team when 3+ Pairs are productive
5. SAFe remains for workstreams where humans write the majority of code
