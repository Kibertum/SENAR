# Руководство SENAR: Конфигурация агентов на практике

Эта глава связывает требования раздела 5 Стандарта (Инструментирование агентов) с практикой. Как писать операционные скрипты, определять профили агентов, управлять изменениями скриптов и применять эти концепции в разных AI-инструментах.

---

## Анатомия операционного скрипта

Операционный скрипт — структурированная инструкция на естественном языке. В отличие от кода, скрипты интерпретирует AI-агент, поэтому они должны быть однозначными, самодостаточными и проверяемыми.

### Минимальная структура скрипта

```
Script: commit
Trigger: /commit command or explicit user request

Preconditions:
- Changes exist in the working tree
- No failing tests

Algorithm:
1. Run git status to see all changes
2. Run git diff to review staged and unstaged changes
3. Analyze changes and draft a commit message:
   - Summarize the nature of changes (feature, fix, refactor...)
   - Keep message under 72 characters for the subject line
4. Stage relevant files (prefer specific files over git add -A)
5. Create the commit
6. Run git status to verify success

Postconditions:
- Commit exists in local repository
- Working tree is clean for committed files

Outputs:
- Commit hash
- Summary of what was committed
```

### Что делает скрипт хорошим

1. **Явные предусловия.** Если скрипт предполагает что-то истинным — укажите это. «Тесты проходят» — это предусловие, а не допущение.

2. **Нумерованные шаги с точками принятия решений.** Когда шаг 3 зависит от результата шага 2, скажите об этом. «Если тесты не прошли, остановиться и сообщить. Если тесты прошли, перейти к шагу 4.»

3. **Определённые результаты.** Что производит скрипт? Коммит? Отчёт? Смену статуса? Будьте конкретны.

4. **Задокументированные граничные случаи.** «Если изменений нет, сообщить об этом и выйти без создания пустого коммита.»

5. **Никаких платформоспецифичных вызовов.** Пишите «Запустить набор тестов», а не «Запустить `npm test`». Скрипт должен работать вне зависимости от стека проекта.

### Антипаттерны

- **Расплывчатые инструкции:** «Убедиться, что всё хорошо» — непроверяемо
- **Неявные знания:** «Использовать стандартный подход» — какой стандартный?
- **Отсутствие обработки ошибок:** Нет указаний на случай провала шагов
- **Избыточная связность:** Один скрипт, который планирует, реализует и проверяет

---

## Определение профилей агентов

Профиль агента ограничивает его действия. В этом и смысл: агент не выходит за рамки назначенной функции.

### Профиль Generator (основная разработка)

```
Profile: Generator
Purpose: Implement code changes for a specific Task

Scripts available:
- implement: Write code to satisfy Task acceptance criteria
- debug: Investigate and fix failures
- commit: Create version-controlled commits
- test: Run and verify test results

Access:
- Read/write: source code, tests, configuration
- Read: task definitions, knowledge base
- Write: task status updates, knowledge entries
- NO access to: deployment, infrastructure, other projects' code

Constraints:
- Changes must stay within Task scope boundaries
- Commits must be atomic (one logical change)
- Must not modify files outside defined scope
```

### Профиль Reviewer (независимая верификация)

```
Profile: Reviewer
Purpose: Independently verify code changes against acceptance criteria

Scripts available:
- review: Check code against acceptance criteria and standards
- security-audit: Scan for security issues
- report: Generate review findings

Access:
- Read-only: source code, tests, configuration, task definitions
- Write: review comments, findings
- NO access to: code modification, commits, deployment

Constraints:
- Cannot modify any code being reviewed
- Findings must reference specific acceptance criteria
- Must check for AI-specific issues (hallucinated APIs, self-validating tests)
```

### Минимально жизнеспособные профили

На уровне SENAR Core необходимо как минимум:
1. **Generator** — для разработки
2. **Reviewer** — для независимой верификации

Ключевая идея: даже если один AI-агент переключается между профилями, переключение создаёт когнитивную границу. Reviewer не может модифицировать код — значит, он оценивает, а не исправляет.

---

## Управление изменениями скриптов

Изменение скрипта меняет поведение AI-агента в продакшене. Относитесь к этому так же строго, как к изменениям продакшен-кода.

### Рабочий процесс изменения скрипта

```
1. Выявить потребность в изменении
   ↓
2. Составить черновик изменения с обоснованием
   ↓
3. Ревью (коллегиальное или самостоятельное, в зависимости от конфигурации)
   ↓
4. Тестирование на изолированном проекте (Team+)
   ↓
5. Развёртывание в целевой проект
   ↓
6. Мониторинг эффективности (FPSR, частота ошибок)
   ↓
7. Запись решения в базу знаний
```

### Тестирование изменений скриптов

Перед развёртыванием изменения скрипта во все проекты:

1. **Выберите типичную задачу** — подберите задачу, аналогичную тем, которые скрипт будет обрабатывать
2. **Выполните задачу со старым скриптом** — зафиксируйте FPSR и проблемы
3. **Выполните аналогичную задачу с новым скриптом** — сравните результаты
4. **Проверьте регрессии** — не сломало ли изменение существующее поведение?

### Откат

Каждое изменение скрипта должно быть обратимым:
- Скрипты находятся под контролем версий — `git revert` работает
- Ведите идентификатор версии в каждом скрипте (дата или semver)
- Документируйте, на что обращать внимание после отката (задачи в процессе могут быть затронуты)

---

## Примеры для конкретных инструментов

### Claude Code

Claude Code использует `CLAUDE.md` для поведенческого контракта и `.claude/skills/` для операционных скриптов.

**Поведенческий контракт** (`CLAUDE.md`):
```markdown
# Project Rules
- NEVER commit without explicit permission
- NEVER modify files outside src/ and tests/
- Run tests before every commit
- Ask before installing new dependencies
```

**Операционный скрипт** (`.claude/skills/review.md`):
```markdown
# Review Skill
Trigger: /review command

Steps:
1. Read the current git diff
2. For each changed file, check:
   a. Does the change match the stated Task goal?
   b. Are there any hardcoded values that should be configurable?
   c. Are error cases handled?
   d. Do tests cover the acceptance criteria, not just code paths?
3. Check for AI-specific issues:
   a. Hallucinated APIs or methods
   b. Non-existent package references
   c. Self-validating test patterns
4. Report findings with specific line references
```

**Переключение профилей:** Claude Code не обеспечивает разрешения профилей на нативном уровне. Реализуйте через правила CLAUDE.md: «При выполнении ревью вы находитесь в режиме Reviewer. НЕ модифицируйте код. Только сообщайте о находках.»

### OpenAI ChatGPT / GPT-4

**Поведенческий контракт** (системный промпт или пользовательские инструкции):
```
You are working in Generator mode. You may:
- Read and write source code and tests
- Create commits with descriptive messages
- Search the codebase

You may NOT:
- Modify deployment configuration
- Access external APIs
- Create files outside the project directory
```

**Операционные скрипты** (структурированные промпты или сохранённые рабочие процессы):
ChatGPT / GPT-4 не имеет нативного механизма навыков/скриптов. Скрипты реализуются как структурированные шаблоны промптов, которые Супервайзер предоставляет в начале каждой задачи.

### Cursor

**Поведенческий контракт** (`.cursorrules`):
```
Rules:
- Always run type checking before suggesting changes as complete
- Never modify files not mentioned in the current task
- Prefer editing existing files over creating new ones
```

**Операционные скрипты** (`.cursor/prompts/` или ручной вызов):
Cursor поддерживает пользовательские промпты, работающие аналогично операционным скриптам. Храните их под контролем версий вместе с проектом.

---

## Практический рабочий процесс: жизненный цикл изменения скрипта

**Сценарий:** Ваш скрипт «implement» порождает код, который часто содержит ошибки типов. Вы хотите добавить шаг «запуск проверки типов» перед отметкой реализации как завершённой.

### Шаг 1: Задокументировать проблему

В базе знаний:
```
Type: observation
Title: Implementation script produces type errors
Body: In the last 5 tasks, 3 had type checking failures caught at CI
  (QG-2). Adding a type check step to the implement script should
  catch these earlier and improve FPSR.
```

### Шаг 2: Составить черновик изменения

Добавить в скрипт implement после шага «написать код»:
```
5. Run the project's type checker
6. If type errors exist:
   a. Fix them
   b. Re-run type checker
   c. Repeat until clean
7. Continue to tests
```

### Шаг 3: Ревью

Для Базовой (Core): самостоятельное ревью — имеет ли добавление смысл? Не конфликтует ли с другими шагами?

Для Командная+: коллегиальное ревью — другой Супервайзер проверяет изменение скрипта. Уточнить: ясен ли новый шаг? Обработаны ли граничные случаи (что если в проекте нет чекера типов)?

### Шаг 4: Тестирование (Командная+)

Выполнить одну задачу с новым скриптом на некритичном проекте. Выполнился ли шаг проверки типов корректно? Обнаружил ли он ошибки типов до CI? Не добавил ли неразумного времени?

### Шаг 5: Развёртывание

Закоммитить изменение скрипта. Обновить идентификатор версии.

### Шаг 6: Мониторинг

На протяжении следующих 5–10 задач отслеживать:
- Снизились ли ошибки проверки типов на CI (QG-2)?
- Значительно ли изменилось время выполнения задач?
- Есть ли неожиданные побочные эффекты?

### Шаг 7: Запись

```
Type: decision
Title: Added type checking step to implement script
Body: After 3/5 tasks had type errors at CI, added explicit type check
  step to implement script. First 5 tasks after change: 0/5 type
  errors at CI. ~2 min added per task, saves ~10 min rework.
```

---

## Итоги

| Концепция | Базовая | Командная+ |
|-----------|------|-------|
| Профили агентов | Generator + Reviewer (РЕКОМЕНДУЕТСЯ) | Все 5 с контролем прав доступа (ОБЯЗАТЕЛЬНО) |
| Операционные скрипты | Под контролем версий, самостоятельное ревью | Рецензируются, тестируются, ведётся реестр |
| Изменения скриптов | Трактуются как изменения процесса | Тестируются на изолированном проекте |
| Откат | Контроль версий обеспечивает | Реестр + явная процедура отката |
| Аудиторский след | Записи в базе знаний | Формальный журнал изменений |
