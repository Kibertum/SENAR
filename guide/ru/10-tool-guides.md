# Руководство SENAR: Интеграция с инструментами

SENAR не привязан к инструментам — стандарт никогда не требует конкретного продукта. Но практики по-разному ложатся на каждый инструмент. Эта глава показывает, как применять SENAR с тремя распространёнными AI-инструментами для кодирования, а также как настроить минимальную базу знаний для команд без инфраструктуры.

---

## SENAR с Claude Code

Claude Code — терминальный AI-агент с постоянной памятью, слеш-командами и интеграцией MCP (Model Context Protocol). Из трёх инструментов он ближе всего к модели AI-агента, которую предполагает SENAR.

### Цель + критерии приёмки → описание задачи в промпте

Передавайте цель и критерии приёмки прямо в промпте. Claude Code хорошо обрабатывает структурированный текст:

```
Implement POST /orders/{id}/cancel endpoint.

Goal: Allow users to cancel their own orders if the order is in "pending" status.

Acceptance criteria:
1. POST /orders/{id}/cancel with valid order in "pending" → 200, status changes to "cancelled"
2. POST /orders/{id}/cancel with order in "shipped" → 409 Conflict
3. POST /orders/{id}/cancel on another user's order → 403
4. Cancelled order cannot be cancelled again → 409
5. Returns 404 for non-existent order ID

Scope: change ONLY src/orders/ and tests/orders/. Follow patterns in src/orders/router.py.
```

### Границы области действия → CLAUDE.md + слеш-команды

`CLAUDE.md` в корне проекта определяет постоянные границы, которые агент читает при каждой сессии:

```markdown
# Boundaries
- NEVER modify files outside src/ and tests/
- NEVER change database migration files directly — use alembic
- Follow existing patterns in router.py, service.py, schemas.py
- Do NOT add dependencies without asking
```

Используйте `/plan` перед сложными задачами, чтобы агент предложил план для проверки перед выполнением.

### База знаний → CLAUDE.md + система памяти

Claude Code имеет два слоя знаний:

| Слой | Соответствие SENAR | Постоянство |
|------|-------------------|-------------|
| `CLAUDE.md` | Знания уровня проекта (правила, паттерны, границы) | В репозитории, под контролем версий |
| Файлы памяти (`~/.claude/projects/*/memory/`) | Тупики, решения, подводные камни | Для каждого пользователя, сохраняются между сессиями |

При столкновении с тупиком прямо скажите Claude Code:

```
Remember this: bcrypt fails on Python 3.14. Always use argon2-cffi.
```

Он запишет в свою систему памяти. Будущие сессии прочтут это автоматически.

Для команд, использующих MCP, записи знаний можно отправлять в общую базу знаний:

```
Create a knowledge entry: "argon2id for password hashing — bcrypt incompatible
with Python 3.14. OWASP recommendation. Use get_password_hash() from auth/utils.py."
```

### Тупики → записи знаний через память или MCP

Немедленная фиксация во время сессии:

```
That approach failed. Remember: SQLAlchemy async sessions cannot use lazy
loading. Must use selectinload() or joinedload() for relationships.
```

### QG-0 → навык /plan

Перед началом задачи используйте `/plan` для проверки достаточности контекста:

```
/plan — Review this task before implementation. Check that goal, AC, and scope
are clear. Flag anything ambiguous.
```

Агент проверяет описание задачи и отмечает недостающие критерии, неоднозначную область действия или невысказанные допущения.

### QG-2 → навык /review

После реализации используйте `/review` для запуска Шлюза качества реализации:

```
/review — Check this implementation against the acceptance criteria.
Verify: tests exist for each AC, mypy clean, no linting violations.
```

### Дисциплина сессий

Claude Code отслеживает количество вызовов инструментов внутренне. Используйте контрольные точки:

```
/checkpoint — Save progress. 47 tool calls since last checkpoint.
```

Передачи сессий сохраняются в системе памяти или в файле передачи, который агент читает при следующем запуске.

---

## SENAR с Cursor

Cursor — форк VS Code со встроенным AI-чатом, контекстом на уровне файлов через `@-упоминания` и правилами уровня проекта через `.cursorrules`.

### Цель + критерии приёмки → .cursorrules + структура промпта

Создайте файл `.cursorrules` с постоянными инструкциями:

```
# Project Rules
- Every implementation MUST have tests for all acceptance criteria
- Follow patterns in existing router/service/schema files
- Never modify database migrations directly
- Use type hints on all function signatures
```

Для каждой задачи структурируйте промпт в чате Cursor одинаково:

```
Goal: [одно предложение]
AC: [нумерованный список]
Scope: [файлы для изменения, файлы НЕ для изменения]
Plan: [упорядоченные шаги]
```

Cursor не принуждает к этой структуре — вы обеспечиваете её привычкой.

### Границы области действия → @file-упоминания

Синтаксис `@file` в Cursor управляет контекстом. Используйте его как ограждение:

```
@src/orders/router.py @src/orders/service.py
Implement order cancellation. Follow the patterns in these files.
Only change files in src/orders/ and tests/orders/.
```

Указание конкретных файлов фокусирует внимание модели и снижает вероятность того, что она выдумает паттерны, не соответствующие вашей кодовой базе.

### База знаний → .cursorrules + документация проекта

Cursor читает `.cursorrules` при каждом промпте. Используйте для накопленных знаний:

```
# Known Issues
- bcrypt fails on Python 3.14 — use argon2-cffi
- SQLAlchemy async: no lazy loading, use selectinload()
- JWT refresh: must use DB-level locking to prevent race conditions
```

Для более крупных баз знаний ведите директорию `docs/knowledge/` и ссылайтесь на неё:

```
@docs/knowledge/dead-ends.md — Read this before implementing auth-related features.
```

### Тупики → файлы знаний или инлайн-документация

Cursor не имеет встроенной системы знаний. Два варианта:

**Вариант A: Файлы знаний** (рекомендуется) — ведите `docs/knowledge/dead-ends.md` и ссылайтесь через `@`:

```markdown
# Dead Ends

- 2026-03-15: bcrypt C extension fails on Python 3.14 → use argon2-cffi
- 2026-03-18: Celery beat + async → use APScheduler instead
- 2026-03-20: pytest-asyncio auto mode breaks fixtures → use mode=strict
```

**Вариант B: Инлайн-комментарии** — добавляйте заметки о тупиках рядом с соответствующим кодом:

```python
# DEAD END: Do not use bcrypt here — C extension fails on Python 3.14.
# Use argon2-cffi via get_password_hash(). See docs/knowledge/dead-ends.md.
from auth.utils import get_password_hash
```

### QG-0 → ручная дисциплина (написать критерии перед промптом)

Cursor не имеет встроенного шлюза. Вы и есть шлюз. Дисциплина:

1. Написать цель + критерии приёмки в промпте чата **до** запроса кода
2. Если ловите себя на набирании «реализуй X» без критериев — остановитесь. Сначала напишите критерии.
3. Держите шаблон задачи (см. Стартовый набор ниже) и вставляйте каждый раз.

### QG-2 → функции ревью Cursor + терминал

После генерации кода AI:

1. Используйте вид diff в Cursor для ревью изменений
2. Запустите тесты в терминале: `pytest tests/ -v`
3. Запустите чекер типов: `mypy src/ --strict`
4. Пройдите критерии приёмки один за другим — есть ли для каждого проходящий тест?

---

## SENAR с GitHub Copilot

GitHub Copilot работает через инлайн-подсказки и Copilot Chat (боковая панель VS Code или ревью PR). Из трёх инструментов у него самое слабое управление контекстом.

### Цель + критерии приёмки → структурированные комментарии перед кодом

Copilot читает окружающий код и комментарии. Используйте структурированные комментарии как промпт:

```python
# TASK: Implement order cancellation endpoint
# GOAL: Allow users to cancel pending orders
# AC-1: POST /orders/{id}/cancel + pending order → 200, status=cancelled
# AC-2: POST /orders/{id}/cancel + shipped order → 409
# AC-3: POST /orders/{id}/cancel + other user's order → 403
# AC-4: Cancelled order → 409 on re-cancel
# AC-5: Non-existent order → 404
# SCOPE: src/orders/router.py, src/orders/service.py, tests/orders/

@router.post("/orders/{order_id}/cancel")
async def cancel_order(  # Copilot дополняет отсюда
```

Это более трудоёмко, чем Claude Code или Cursor, но работает: Copilot использует комментарии как контекст для подсказок.

### Границы области действия → контекст уровня файлов

Контекст Copilot — преимущественно открытый файл и связанные файлы. Управляйте областью действия:

- Держите нужные файлы открытыми во вкладках (Copilot читает открытые файлы)
- Держите несвязанные файлы закрытыми
- Используйте Copilot Chat с явными ссылками на файлы: «Following the pattern in `src/orders/router.py`, implement...»

### База знаний → документация кодовой базы (правило 9.11)

Copilot обучается на вашей кодовой базе. Правило 9.11 (Полнота документации) напрямую улучшает результаты Copilot:

- Docstrings на каждой публичной функции → Copilot генерирует согласованные новые функции
- Аннотации типов повсюду → Copilot генерирует типизированный код
- `README.md` в каждом модуле → Copilot понимает назначение модуля

```python
"""Order service — handles order lifecycle operations.

Patterns:
- All mutations go through service layer, never router
- Use get_or_404() for entity lookup
- Status transitions validated via Order.can_transition_to()
"""
```

### Тупики → файлы ADR или документирующие комментарии

Используйте Architecture Decision Records в `docs/adr/`:

```markdown
# ADR-007: Password Hashing Algorithm

## Status: Accepted

## Context
Need password hashing for auth module. bcrypt C extension fails on Python 3.14.

## Decision
Use argon2-cffi with argon2id algorithm via shared get_password_hash() utility.

## Consequences
- All password operations use one utility function
- argon2-cffi must remain in dependencies
- Do not add bcrypt as alternative
```

Copilot читает файлы ADR, когда они открыты, и Copilot Chat можно направить к ним явно.

### QG-0 → ручная дисциплина (перед реализацией)

Ручная дисциплина — написать цель + критерии приёмки в файле трекера задач или issue до начала работы с AI. Copilot не имеет встроенного шлюза на этапе до реализации; используйте TASK_TEMPLATE.md или шаблоны issue как механизм контроля.

1. Написать цель + критерии приёмки в GitHub issue или `TASK_TEMPLATE.md` **до** открытия редактора
2. Если ловите себя на промптинге Copilot без критериев — остановитесь. Сначала напишите критерии.
3. Держите шаблон задачи (см. Стартовый набор ниже) и заполняйте каждый раз.

### QG-2 → шаблон PR + CI-пайплайн + ревью PR

Поскольку Copilot интегрирован с GitHub, используйте шаблоны PR как пост-реализационный шлюз:

```markdown
<!-- .github/PULL_REQUEST_TEMPLATE.md -->
## Task
- [ ] Goal defined
- [ ] Acceptance criteria listed below
- [ ] Scope boundaries stated

## Acceptance Criteria
1.
2.
3.

## Verification
- [ ] Each AC has a passing test
- [ ] mypy/tsc clean
- [ ] No new linting violations

## Knowledge
- Dead ends encountered:
- Decisions made:
```

PR нельзя открыть без заполнения. Рецензенты проверяют по нему.

Кроме того, естественный QG-2 Copilot включает CI-пайплайн:

1. GitHub Actions запускает тесты, чекер типов, линтер
2. Copilot Chat (режим ревью PR) проверяет diff
3. Рецензент-человек проверяет соответствие критериев тестам

Это менее оперативно, чем верификация внутри сессии Claude Code, но работает в сочетании с шаблоном PR.

---

## Базовая база знаний (без инфраструктуры)

Вам не нужна база данных, вики или специализированный инструмент. Достаточно трёх файлов в репозитории:

```
docs/
  knowledge/
    dead-ends.md      — одна строка на тупик
    decisions.md      — один абзац на решение
    gotchas.md        — одна строка на подводный камень
```

### dead-ends.md

```markdown
# Dead Ends

Approaches that failed. Check here before trying something new.

- 2026-03-15: bcrypt — C extension fails on Python 3.14. Use argon2-cffi.
- 2026-03-18: Celery beat with async workers — event loop conflicts. Use APScheduler.
- 2026-03-20: pytest-asyncio auto mode — breaks fixtures with scope=session. Use mode=strict.
- 2026-03-21: SQLAlchemy lazy loading in async — not supported. Use selectinload().
- 2026-03-22: Redis Sentinel with asyncio — aioredis deprecated. Use redis-py >= 5.0.
```

Формат: `дата: что пробовали — почему не сработало. Что использовать вместо.`

Одна строка. Десять секунд на написание. Экономит часы.

### decisions.md

```markdown
# Decisions

Architectural and technical decisions with context.

## Password Hashing: argon2id
**Date:** 2026-03-15
**Context:** Need password hashing for auth module.
**Decision:** Use argon2-cffi with argon2id via `get_password_hash()` in `src/auth/utils.py`.
**Reason:** OWASP recommendation, Python 3.14 compatible, bcrypt fails (see dead-ends.md).

## Task Queue: APScheduler over Celery
**Date:** 2026-03-18
**Context:** Need periodic tasks (token cleanup, report generation).
**Decision:** Use APScheduler with AsyncIOScheduler.
**Reason:** Celery beat has event loop conflicts with async FastAPI. APScheduler runs in-process.
```

Формат: заголовок, дата, контекст (одно предложение), решение (одно предложение), причина (одно предложение).

### gotchas.md

```markdown
# Gotchas

Things that are technically correct but surprising. Not bugs — just traps.

- SQLAlchemy: `session.refresh()` after commit or you get stale data in tests
- FastAPI: `Depends()` in test overrides must match the exact function, not just signature
- pytest: fixture scope=session + async requires `event_loop` fixture override
- Docker: `COPY requirements.txt .` before `COPY . .` — layer cache invalidation order matters
- PostgreSQL: `SERIAL` vs `GENERATED ALWAYS AS IDENTITY` — use IDENTITY for new tables
```

Формат: одна строка. Контекст: поведение. Это всё.

### Почему это работает

AI-агенты читают ваш репозиторий. Когда `docs/knowledge/dead-ends.md` находится в репозитории, каждый промпт для AI имеет к нему доступ — будь то автоматическое чтение файлов Claude Code, `@file`-упоминания Cursor или контекст открытых вкладок Copilot.

База знаний версионируется, поддерживает поиск и растёт с каждой сессией. Никакого внешнего инструмента не требуется.

---

## Стартовый набор SENAR

Готовые к копированию шаблоны для немедленного использования.

### TASK_TEMPLATE.md

```markdown
# Task: [slug]

## Goal
[Одно предложение: что должно быть сделано]

## Acceptance Criteria
1. [Первый критерий — тестируется независимо]
2. [Второй критерий]
3. [Третий критерий]

## Requirement Link
Story: [story-slug]
BR: [ID бизнес-требования, если применимо]

## Scope
- Change ONLY: [директории/файлы]
- Do NOT change: [защищённые файлы/директории]
- Follow patterns in: [файлы-образцы]

## Plan
1. [Первый шаг]
2. [Второй шаг]
3. [Третий шаг]

## Notes
[Контекст, тупики, которых следует избегать, связанные записи базы знаний]
```

### .github/PULL_REQUEST_TEMPLATE.md

```markdown
## Summary
[Одно предложение: что делает этот PR]

## Acceptance Criteria
- [ ] AC-1: [критерий из задачи]
- [ ] AC-2: [критерий из задачи]
- [ ] AC-3: [критерий из задачи]

## Verification
- [ ] All AC have corresponding tests
- [ ] Tests pass locally
- [ ] Type checker clean (mypy/tsc/pyright)
- [ ] Linter clean
- [ ] No new dependencies added (or justified below)

## Dead Ends Encountered
<!-- Подходы, которые не сработали при выполнении задачи. Перенести в docs/knowledge/dead-ends.md -->
- None / [описание]

## Decisions Made
<!-- Архитектурные или технические решения. Перенести в docs/knowledge/decisions.md -->
- None / [описание]

## Knowledge Entries
<!-- Подводные камни, паттерны или неочевидное поведение, обнаруженное в процессе -->
- None / [описание]
```

### docs/knowledge/README.md

```markdown
# Knowledge Base

This directory contains accumulated project knowledge from SENAR sessions.

## Files

| File | Purpose | Format |
|------|---------|--------|
| `dead-ends.md` | Approaches that failed | One line per entry |
| `decisions.md` | Architectural/technical decisions | One paragraph per entry |
| `gotchas.md` | Surprising but correct behaviors | One line per entry |

## How to Use

**Before starting a task:** Check `dead-ends.md` for the area you're working in.

**During a task:** When an approach fails, add one line to `dead-ends.md`.
When you make an architectural choice, add a paragraph to `decisions.md`.
When you discover something surprising, add a line to `gotchas.md`.

**After a task:** Review what you learned. If any dead ends, decisions, or
gotchas were captured in the PR template, move them to the appropriate file.

## For AI Agents

If you are an AI coding agent reading this: check `dead-ends.md` before
attempting any approach in a domain that has entries. Check `gotchas.md`
for the libraries and frameworks you are about to use. Check `decisions.md`
for architectural context.
```

---

## Варианты базы знаний

SENAR не предписывает конкретный инструмент для базы знаний. Распространённые подходы по размеру команды:

- **Solo/Базовая**: Markdown-файлы в репозитории проекта (например, `docs/knowledge/`)
- **Начальная (1–3 пары)**: Вики проекта, Notion или структурированные YAML/JSON в репозитории
- **Командная (3–10)**: Специализированный инструмент с поиском — CouchDB+Meilisearch, Confluence, Linear docs
- **Корпоративная (10+)**: Федеративные базы знаний по проектам с кросс-проектным поиском

Ключевое требование: знания должны быть доступны для поиска AI-агентами в будущих сессиях.

---

## Выбор инструмента

| Практика SENAR | Claude Code | Cursor | GitHub Copilot |
|----------------|-------------|--------|----------------|
| Цель + критерии приёмки | Текст промпта | Текст промпта | Структурированные комментарии |
| Границы области действия | CLAUDE.md + промпт | .cursorrules + @file | Открытые вкладки + промпт |
| База знаний | Память + MCP | .cursorrules + docs/ | docs/ + ADR |
| Фиксация тупиков | Записи памяти | Файлы знаний | Файлы ADR |
| Контроль QG-0 | навык /plan | Ручная дисциплина | Шаблон задачи / issue |
| Контроль QG-2 | навык /review | Терминал + вид diff | Шаблон PR + CI-пайплайн |
| Передача сессии | Система памяти | Файл передачи | Описание PR |
| Сохранение контекста | Автоматическое (память) | Ручное (@file) | Ручное (открытые файлы) |

Инструмент не создаёт процесс. Процесс делает инструмент полезным. Дисциплинированный Супервайзер с обычным текстовым редактором обойдёт Супервайзера с лучшим AI-инструментом, но без критериев приёмки.
