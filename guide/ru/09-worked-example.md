# Руководство SENAR: Полный цикл одной задачи

Это не диаграмма. Это одна задача, от требования до завершения, именно так, как это происходит на практике. Задача: добавить эндпоинт сброса пароля в REST API.

Стек: Python 3.14, FastAPI, PostgreSQL, pytest. Конфигурация: SENAR Core (одиночный Супервайзер).

---

## 1. Требование

В бэклоге продукта есть бизнес-требование:

> **BR-042:** Пользователи должны иметь возможность сбрасывать пароли без обращения в поддержку.

Супервайзер декомпозирует его в запись задачи:

```yaml
task: impl-password-reset
story: user-authentication
goal: >
  Реализовать эндпоинты POST /auth/password-reset/request и
  POST /auth/password-reset/confirm, позволяющие пользователям
  сбрасывать пароль через токен с ограниченным сроком действия.
acceptance_criteria:
  1. POST /auth/password-reset/request с валидным email возвращает 202 и создаёт токен сброса
  2. POST /auth/password-reset/request с неизвестным email возвращает 202 (без утечки информации)
  3. Токен сброса истекает через 30 минут
  4. POST /auth/password-reset/confirm с валидным токеном + новым паролем обновляет пароль и аннулирует токен
  5. POST /auth/password-reset/confirm с истёкшим или невалидным токеном возвращает 400
  6. POST /auth/password-reset/confirm с паролем короче 8 символов возвращает 422
role: supervisor
complexity: M
```

Затраченное время: ~2 минуты.

---

## 2. Проверка Стартового шлюза (QG-0 в Стандарте)

Перед переводом задачи в статус `active` система проверяет критерии Шлюза качества контекста:

| Критерий | Статус |
|----------|--------|
| Цель непустая | **ПРОЙДЕН** — цель описывает оба эндпоинта и их назначение |
| Критерии приёмки существуют | **ПРОЙДЕН** — 6 критериев, каждый тестируем независимо |
| Связь с историей установлена | **ПРОЙДЕН** — привязано к `user-authentication` |
| Роль назначена | **ПРОЙДЕН** — `supervisor` |

Стартовый шлюз (QG-0): **ПРОЙДЕН**. Задача переходит в `active`.

---

## 3. Промпт для AI

Супервайзер открывает терминал и даёт AI-агенту такой промпт:

```
Implement password reset for our auth module.

Goal: POST /auth/password-reset/request and POST /auth/password-reset/confirm
endpoints. Request creates a time-limited token. Confirm validates the token
and updates the password.

Acceptance criteria:
1. POST /request with valid email → 202, creates reset token
2. POST /request with unknown email → 202 (no information leak)
3. Token expires after 30 minutes
4. POST /confirm with valid token + new password → updates password, invalidates token
5. POST /confirm with expired/invalid token → 400
6. POST /confirm with password < 8 chars → 422

Scope:
- Change ONLY files in src/auth/ and tests/auth/
- Follow the patterns in src/auth/router.py and src/auth/service.py
- Do NOT modify the User model — add a new PasswordResetToken model
- Use the existing get_password_hash() for hashing
- Do NOT add new dependencies without asking

Plan:
1. Create PasswordResetToken model in src/auth/models.py
2. Add reset request/confirm logic in src/auth/service.py
3. Add endpoints in src/auth/router.py
4. Add schemas in src/auth/schemas.py
5. Write tests for all 6 AC
```

Затраченное время: ~1 минута (большая часть уже была в записи задачи).

---

## 4. Результат работы AI

AI генерирует четыре файла:

**`src/auth/models.py`** — добавляет модель `PasswordResetToken`:

```python
class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    token: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    expires_at: Mapped[datetime] = mapped_column()
    used: Mapped[bool] = mapped_column(default=False)
```

**`src/auth/schemas.py`** — добавляет схемы запрос/ответ:

```python
class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(min_length=8)
```

**`src/auth/service.py`** — добавляет две сервисные функции:

```python
from datetime import timezone

async def request_password_reset(db: AsyncSession, email: str) -> None:
    user = await get_user_by_email(db, email)
    if user is None:
        return  # AC-2: без утечки информации
    token = secrets.token_urlsafe(48)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)  # AC-3
    reset = PasswordResetToken(user_id=user.id, token=token, expires_at=expires_at)
    db.add(reset)
    await db.commit()


async def confirm_password_reset(
    db: AsyncSession, token: str, new_password: str
) -> None:
    reset = await db.execute(
        select(PasswordResetToken).where(
            PasswordResetToken.token == token,
            PasswordResetToken.used == False,
        )
    )
    reset = reset.scalar_one_or_none()
    if reset is None or reset.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    user = await db.get(User, reset.user_id)
    user.password_hash = get_password_hash(new_password)
    reset.used = True  # AC-4: аннулировать токен
    await db.commit()
```

**`src/auth/router.py`** — добавляет два эндпоинта:

```python
@router.post("/password-reset/request", status_code=202)
async def password_reset_request(
    body: PasswordResetRequest, db: AsyncSession = Depends(get_db)
):
    await request_password_reset(db, body.email)
    return {"detail": "If the email exists, a reset link has been sent"}


@router.post("/password-reset/confirm", status_code=200)
async def password_reset_confirm(
    body: PasswordResetConfirm, db: AsyncSession = Depends(get_db)
):
    await confirm_password_reset(db, body.token, body.new_password)
    return {"detail": "Password updated"}
```

**`tests/auth/test_password_reset.py`** — шесть тестов:

```python
async def test_request_reset_valid_email(client, db, user):
    """AC-1: валидный email возвращает 202, токен создан."""
    resp = await client.post("/auth/password-reset/request", json={"email": user.email})
    assert resp.status_code == 202
    token = await db.execute(select(PasswordResetToken).where(
        PasswordResetToken.user_id == user.id
    ))
    assert token.scalar_one_or_none() is not None


async def test_request_reset_unknown_email(client):
    """AC-2: неизвестный email возвращает 202 (без утечки)."""
    resp = await client.post("/auth/password-reset/request",
                             json={"email": "nobody@example.com"})
    assert resp.status_code == 202


async def test_token_expires_after_30_minutes(client, db, user):
    """AC-3: токен создан со сроком действия 30 минут."""
    await client.post("/auth/password-reset/request", json={"email": user.email})
    token = (await db.execute(select(PasswordResetToken))).scalar_one()
    delta = token.expires_at - datetime.now(timezone.utc)
    assert 29 * 60 < delta.total_seconds() < 31 * 60


async def test_confirm_reset_valid_token(client, db, user, reset_token):
    """AC-4: валидный токен + новый пароль → пароль обновлён, токен аннулирован."""
    resp = await client.post("/auth/password-reset/confirm",
                             json={"token": reset_token.token, "new_password": "newsecure123"})
    assert resp.status_code == 200
    await db.refresh(reset_token)
    assert reset_token.used is True
    await db.refresh(user)
    assert verify_password("newsecure123", user.password_hash)


async def test_confirm_reset_expired_token(client, expired_reset_token):
    """AC-5: истёкший токен возвращает 400."""
    resp = await client.post("/auth/password-reset/confirm",
                             json={"token": expired_reset_token.token, "new_password": "newsecure123"})
    assert resp.status_code == 400


async def test_confirm_reset_short_password(client, reset_token):
    """AC-6: пароль короче 8 символов возвращает 422."""
    resp = await client.post("/auth/password-reset/confirm",
                             json={"token": reset_token.token, "new_password": "short"})
    assert resp.status_code == 422
```

---

## 5. Верификация по критериям приёмки

Супервайзер не просматривает код бегло, чтобы сказать «выглядит нормально». Супервайзер проходит критерии приёмки один за другим:

| Критерий | Что проверить | Вердикт |
|----------|--------------|---------|
| 1. Валидный email → 202 + токен создан | `test_request_reset_valid_email` проверяет 202 и наличие токена в БД | **ПРОЙДЕН** |
| 2. Неизвестный email → 202 | `test_request_reset_unknown_email` проверяет 202 без ошибки | **ПРОЙДЕН** |
| 3. Токен истекает через 30 мин | `test_token_expires_after_30_minutes` проверяет дельту `expires_at` | **ПРОЙДЕН** |
| 4. Валидное подтверждение → обновляет пароль, аннулирует токен | `test_confirm_reset_valid_token` проверяет `used=True` и смену пароля | **ПРОЙДЕН** |
| 5. Истёкший/невалидный токен → 400 | `test_confirm_reset_expired_token` проверяет 400 | **ПРОЙДЕН** |
| 6. Короткий пароль → 422 | `test_confirm_reset_short_password` проверяет 422 | **ПРОЙДЕН** |

Каждый критерий имеет соответствующий тест. Каждый тест проверяет ожидаемое поведение, а не реализацию.

Затраченное время: ~3 минуты на чтение тестов и подтверждение соответствия.

---

## 6. Тупик

Но сначала — кое-что пошло не так в ходе выполнения.

Первая попытка AI использовала `bcrypt` для утилиты хеширования паролей, добавленной вместе с эндпоинтом:

```python
from bcrypt import hashpw, gensalt

def get_password_hash(password: str) -> str:
    return hashpw(password.encode(), gensalt()).decode()
```

При запуске тестов:

```
E   ModuleNotFoundError: No module named '_bcrypt'
```

Пакет `bcrypt` содержит C-расширение, которое не компилируется на Python 3.14 (по состоянию на март 2026). Супервайзер направил AI:

```
bcrypt import fails on Python 3.14. Switch to argon2-cffi with argon2id hasher.
The existing get_password_hash() already uses argon2 — don't create a new one,
use the existing function.
```

AI переключился на использование существующей `get_password_hash()` из `src/auth/utils.py` (которая уже использует `argon2-cffi`). Тесты проходят.

Супервайзер создаёт запись тупика:

```
Dead end: bcrypt package — C extension fails to compile on Python 3.14.
Switched to argon2-cffi (argon2id). The existing get_password_hash() utility
already uses argon2id. Don't add bcrypt to new endpoints.
```

Затраченное время: ~30 секунд на написание записи.

---

## 7. Проверка Финального шлюза (QG-2 в Стандарте)

Супервайзер запускает Шлюз качества реализации:

```
$ pytest tests/auth/test_password_reset.py -v
======================== 6 passed in 2.14s ========================

$ mypy src/auth/ --strict
Success: no issues found in 6 source files

$ ruff check src/auth/
All checks passed!
```

| Критерий | Статус |
|----------|--------|
| CI-пайплайн проходит | **ПРОЙДЕН** — всё зелёное |
| Все тесты проходят | **ПРОЙДЕН** — 6/6 |
| Типы чисты | **ПРОЙДЕН** — mypy strict, ноль ошибок |
| Нет новых нарушений линтера | **ПРОЙДЕН** — ruff чист |
| Критерии приёмки верифицированы | **ПРОЙДЕН** — все 6 проверены в разделе 5 |
| Нет уязвимостей безопасности | **ПРОЙДЕН** — `argon2id` рекомендован OWASP; нет новых зависимостей с CVE |

Финальный шлюз (QG-2): **ПРОЙДЕН**. Задача переходит в `done`.

Затраченное время: ~2 минуты (в основном ожидание CI).

> **Измерение FPSR на практике:** Считайте задачу «успехом с первой попытки», если она проходит QG-2 без возврата в статус active. Отслеживайте через инструмент управления задачами: задачи, прошедшие путь planning→active→done = успех; задачи, прошедшие active→done→active→done = переделка. FPSR = успехи / всего завершённых × 100%.

---

## 8. Фиксация знаний

Супервайзер создаёт запись знания для решения, принятого при выполнении задачи:

```yaml
type: decision
title: "Using argon2id for all password hashing"
context: >
  Password reset endpoint needed hashing. bcrypt fails on Python 3.14.
  argon2id is the OWASP recommendation and already used in get_password_hash().
decision: >
  All password operations use argon2-cffi with argon2id algorithm via
  the shared get_password_hash() utility in src/auth/utils.py.
  Do not introduce bcrypt or any other hashing library.
related_dead_end: "bcrypt C extension incompatible with Python 3.14"
```

Затраченное время: ~30 секунд.

---

## 9. Фрагмент завершения сессии

При завершении сессии передача фиксирует всё, что нужно будущей сессии (или другому Супервайзеру):

```
Session #12 — 2026-03-22 — 95 minutes — 4 tasks done

Completed:
  - impl-password-reset (this task)
  - impl-email-verification
  - fix-jwt-refresh-race
  - impl-logout-endpoint

Dead ends:
  - bcrypt C extension fails on Python 3.14 → use argon2-cffi

Knowledge entries:
  - decision: argon2id for all password hashing (OWASP, Python 3.14 compat)
  - gotcha: JWT refresh token race condition — need DB-level locking

Next session:
  - impl-oauth-google — Google OAuth integration
  - impl-rate-limiting — rate limit on auth endpoints (5 req/min)

Warnings:
  - OAuth requires new env vars (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
    — add before starting the task
```

---

## Что это стоило

| Шаг | Время |
|-----|-------|
| Написание цели + критериев приёмки | ~2 мин |
| Написание промпта для AI | ~1 мин |
| AI генерирует код + тесты | ~3 мин (ожидание) |
| Верификация по критериям приёмки | ~3 мин |
| Документирование тупика | ~30 сек |
| Запись знания | ~30 сек |
| **Итого** | **~10 мин** |

Без AI эта задача — два эндпоинта, модель, схемы, шесть тестов, исследование хеширования — заняла бы примерно 25–40 минут ручного кодирования.

Накладные расходы дисциплины SENAR (цель, критерии, верификация, фиксация знаний) добавляют к задаче примерно 4 минуты. AI генерирует остальные 6 минут работы. Итог: полностью протестированный, задокументированный, прослеживаемый эндпоинт менее чем за 10 минут.

Но реальная экономия — не в этой сессии. Она в следующей сессии, когда кто-то (или AI-агент) будет добавлять ещё один эндпоинт авторизации и найдёт:
- Тупик, который убережёт от 15 минут потерянных на bcrypt.
- Решение, указывающее использовать `get_password_hash()`.
- Паттерн критериев приёмки, который можно скопировать для следующего эндпоинта.

Именно эта будущая экономия времени — то, за счёт чего SENAR многократно окупает себя.

---

## Ключевые выводы

1. **Критерии приёмки сделали основную работу.** Шесть критериев, написанных за 2 минуты, определили всю реализацию — что AI сгенерировал, что тесты проверяют, что Супервайзер верифицировал. Без них Супервайзеру пришлось бы читать код и гадать, правильно ли он написан.

2. **Тупик — инвестиция, а не накладные расходы.** Тридцать секунд набора текста экономят следующему человеку (или AI) повторение той же ошибки. В базе знаний со 100+ тупиками это складывается в часы экономии за инкремент.

3. **Финальный шлюз (QG-2) — не церемония.** Это ваш тестовый раннер, чекер типов, линтер и таблица верификации — конкретные инструменты зависят от стека. Это занимает 2 минуты. Если хоть одна строка красная — задача не завершена. Никаких суждений, никаких «наверное, нормально».

4. **Передача делает сессии независимыми.** Сессию #13 может начать другой человек, другой AI-агент или тот же Супервайзер после выходных. Всё необходимое — в передаче: никакого племенного знания, никакого «дай вспомню, на чём я остановился».

---

## Примечание к этому примеру

Этот разбор показывает сценарий чистого прохождения: один тупик, одна повторная попытка, всё зелёное со второго раза. Реальные сессии часто более запутанны — множественные тупики, частичные провалы тестов, критерии приёмки, оказавшиеся двусмысленными в ходе реализации, неожиданные конфликты зависимостей. Этот пример демонстрирует структуру рабочего процесса SENAR, а не типичный уровень сложности. Ваши сессии будут различаться.

---

## Вариации стека

Практики, описанные выше, применимы одинаково вне зависимости от технологического стека. Вот те же паттерны критериев приёмки для распространённых стеков:

> **Примечание:** Вариации стека иллюстрируют паттерны, специфичные для конкретного фреймворка, а не точный перевод примера на Python. Адаптируйте критерии приёмки под соглашения вашего стека.

### Java / Spring Boot
**Задача:** Реализовать эндпоинт сброса пароля
**Критерии приёмки:**
1. POST /api/v1/auth/reset-password принимает {email} → возвращает 200 (без перечисления email)
2. Токен хранится с хешем BCrypt, истекает через 1 час
3. Ограничение частоты: 3 запроса на email в час (@RateLimiter или фильтр)
4. Интеграционный тест с @SpringBootTest и MockMvc
5. Негативный: невалидный токен возвращает 400, истёкший — 410

### Go / Gin
**Задача:** Реализовать эндпоинт сброса пароля
**Критерии приёмки:**
1. POST /api/v1/auth/reset-password принимает {email} → возвращает 200
2. Токен хранится с bcrypt.GenerateFromPassword, срок действия 1 час
3. Ограничение частоты: middleware с sync.Map или Redis
4. Табличные тесты с testify
5. Негативный: невалидный/истёкший токен возвращает соответствующий статус

### TypeScript / NestJS
**Задача:** Реализовать эндпоинт сброса пароля
**Критерии приёмки:**
1. POST /api/v1/auth/reset-password принимает {email} → возвращает 200
2. Токен хранится с bcrypt.hash, TTL 1 час
3. Декоратор @Throttle() или кастомный guard
4. Jest e2e-тест с supertest
5. Негативный: ValidationPipe отклоняет некорректный ввод

Полные разборы для Java/Spring Boot, Go и TypeScript/NestJS запланированы для SENAR Guide v1.4.
