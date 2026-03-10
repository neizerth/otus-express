# OAuth 2.0 — пример (11-oauth.ts)

Самодостаточный пример потока OAuth 2.0: один сервер играет и провайдера, и клиента. Регистрация во внешних сервисах не нужна.

## Запуск

```bash
npx tsx 11-oauth.ts
```

В консоли появится: `http://localhost:3011`

## Как показать весь процесс

### 1. Открыть стартовую страницу

В браузере откройте **http://localhost:3011**

Увидите страницу с одной ссылкой: **«Войти»**.

### 2. Нажать «Войти»

Клик по ссылке ведёт на **провайдера** (`/oauth/authorize`). Сервер:

- проверяет `client_id` и `response_type=code`;
- создаёт одноразовый `code`;
- сразу делает редирект обратно на **клиент** по `redirect_uri` с параметром `?code=...`.

В браузере вы мгновенно перейдёте на адрес вида:

`http://localhost:3011/callback?code=...`

### 3. Callback — обмен code на «вход»

Обработчик `/callback`:

- забирает `code` из query;
- вызывает общую функцию обмена code → access token;
- по токену считает пользователя «demo-user» и отдаёт страницу **«Готово. Вы вошли как demo-user»**.

На этом поток «логин через OAuth» завершён.

### 4. (Опционально) Показать обмен code на token «по-настоящему»

Чтобы увидеть стандартный шаг **обмен authorization code на access_token** через POST, можно вызвать API вручную.

Сначала получите `code`: повторите шаги 1–2 и скопируйте из адресной строки значение `code` из URL после редиректа (до перехода на страницу «Готово»). Либо один раз откройте в новой вкладке:

```
http://localhost:3011/oauth/authorize?client_id=demo-client&redirect_uri=http://localhost:3011/callback&response_type=code
```

В редиректе в URL будет `code=...` — скопируйте этот код.

Затем выполните обмен (подставьте свой `CODE`):

```bash
curl -X POST http://localhost:3011/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=CODE" \
  -d "client_id=demo-client" \
  -d "client_secret=demo-secret" \
  -d "redirect_uri=http://localhost:3011/callback"
```

В ответ придёт JSON, например:

```json
{
  "access_token": "a1b2c3...",
  "token_type": "Bearer"
}
```

### 5. Запрос к защищённому ресурсу провайдера

С полученным `access_token` можно запросить «профиль» у провайдера:

```bash
curl -H "Authorization: Bearer ВАШ_ACCESS_TOKEN" http://localhost:3011/oauth/user
```

Ответ:

```json
{
  "id": "demo-user",
  "name": "Demo User"
}
```

## Схема потока

```
Браузер                    Клиент (/)              Провайдер (/oauth/*)
   |                            |                            |
   |  GET /                     |                            |
   |  «Войти»                   |                            |
   |  GET /oauth/authorize?client_id=...&redirect_uri=...&response_type=code
   |  ------------------------------------------------>      |
   |                            |   редирект с code          |
   |  GET /callback?code=XXX     | <----------------          |
   |  ------------------------------------------------>      |
   |                            |  exchangeCode(code)        |
   |  «Готово, вы вошли»        |  страница с результатом    |
   | <-------------------------------------------------------|
```

Итого: **запуск** → **открыть http://localhost:3011** → **«Войти»** → **редирект с code** → **страница «Готово»** — так можно показать весь процесс от начала до конца.
