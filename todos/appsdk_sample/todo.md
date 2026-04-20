# AppSDK Sample App

## Ziel
Neue Next.js-App unter `apps/appsdk_sample` erstellen, die das ProcessCube AppSDK nutzt und einen Beispiel-External-Task-Worker enthält.

## Vorbedingungen
- Authority hat bereits `externalTaskWorkers`-Config mit `external_task_worker` Client (vorhanden)
- Engine, Authority, Postgres laufen bereits via docker-compose

## Aufgaben

### App erstellen
- [x] `apps/appsdk_sample/` Verzeichnis mit Next.js-App-Struktur anlegen
- [x] `package.json` mit Dependencies (next, react, next-auth, @5minds/processcube_app_sdk)
- [x] `tsconfig.json`
- [x] `next.config.ts` mit `withApplicationSdk` Plugin
- [x] `.env.local.example` mit Dokumentation der Env-Vars
- [x] `.env.local` mit Werten passend zur docker-compose
- [x] `app/layout.tsx` — Root Layout
- [x] `app/page.tsx` — Startseite
- [x] `app/appsdk_greeting/external_task.ts` — Beispiel External Task Handler

### BPMN-Prozess
- [x] `processes/AppSDK_Sample.bpmn` — Einfacher Prozess mit External Task (Topic: `appsdk_greeting`)

### Docker-Integration
- [x] `apps/appsdk_sample/Dockerfile` — Multi-Stage Next.js Build (mit python3/make/g++ für native Module)
- [x] `apps/appsdk_sample/.dockerignore` — node_modules, .next, .env.local ausschließen
- [x] `docker-compose.yml` — Neuen `appsdk_sample` Service ergänzen (Port konfigurierbar via `APPSDK_SAMPLE_PORT`, Default 3000)

### Abschluss
- [x] `npm install` + `npm run build` testen
- [x] docker compose build + up testen

## Review

### Erstellte Dateien
- `apps/appsdk_sample/package.json` — Next.js 15 + AppSDK 8.4.0 + next-auth
- `apps/appsdk_sample/tsconfig.json` — TypeScript-Config (ES2024, bundler)
- `apps/appsdk_sample/next.config.ts` — withApplicationSdk + standalone Output
- `apps/appsdk_sample/.env.local.example` — Template für Env-Vars
- `apps/appsdk_sample/.env.local` — Konfiguration für Docker-Netzwerk
- `apps/appsdk_sample/.dockerignore` — Excludes node_modules, .next, .env.local
- `apps/appsdk_sample/Dockerfile` — Multi-Stage Build (deps → builder → runner)
- `apps/appsdk_sample/app/layout.tsx` — Root Layout
- `apps/appsdk_sample/app/page.tsx` — Startseite
- `apps/appsdk_sample/app/appsdk_greeting/external_task.ts` — Greeting External Task Handler
- `processes/AppSDK_Sample.bpmn` — BPMN-Prozess mit External Task (Topic: appsdk_greeting)

### Geänderte Dateien
- `docker-compose.yml` — Neuer Service `appsdk_sample` (Port via `APPSDK_SAMPLE_PORT`, Default 3000)

### Hinweise
- Authority war bereits konfiguriert (externalTaskWorkers mit client_id `external_task_worker`)
- Dockerfile benötigt python3/make/g++ für native Module (utf-8-validate via node-gyp)
- External Task Handler gibt `{ greeting, processedAt }` zurück
- Die Warnung `serverComponentsExternalPackages` kommt vom AppSDK und ist unkritisch
