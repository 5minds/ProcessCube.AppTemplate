# CLAUDE.md

Diese Datei bietet Claude Code (claude.ai/code) Orientierung bei der Arbeit mit dem Code in diesem Repository.

## Projektübersicht

ProcessCube.AppTemplate ist ein Template zur Entwicklung eigener Apps für die ProcessCube-Plattform. Es unterstützt zwei App-Typen:

- **LowCode** (Node-RED) — Custom-Nodes, Plugins und Dashboard-2-Widgets in JavaScript/Vue.js
- **AppSDK** (Next.js) — Moderne Web-Apps mit External Tasks und UserTasks in TypeScript/React

## Architektur

Sechs Docker-Services bilden die Plattform:

- **engine** (Port 8000) — ProcessCube BPMN-Workflow-Engine mit PostgreSQL-Backend
- **authority** (Port 11560) — OAuth2/OIDC-Identity-Provider
- **postgres** (Port 5432, dynamisches externes Mapping) — PostgreSQL 18 (ProcessCube.Postgres), erstellt automatisch `engine`, `authority`, `appdb`
- **whodb** (Port 8080) — Web-basierte Datenbankverwaltung
- **lowcode** (Port 1880, Debug-Port 9229) — Node-RED mit Custom-Nodes/-Widgets, gebaut aus `apps/lowcode/Dockerfile`
- **appsdk_sample** (Port 3000, konfigurierbar via `APPSDK_SAMPLE_PORT`) — Next.js AppSDK-Beispielapp, gebaut aus `apps/appsdk_sample/Dockerfile`

Abhängigkeiten: lowcode und appsdk_sample hängen von engine + authority ab (Healthcheck). Engine und authority hängen von postgres ab (Healthcheck).

## Wichtige Verzeichnisse

- `apps/lowcode/src/` — Custom-Node-RED-Nodes, Plugins und Vue.js-Widgets
- `apps/appsdk_sample/` — Next.js AppSDK-App mit External Tasks und UserTasks
- `apps/appsdk_sample/app/` — Next.js App Router (Pages, Actions, External Task Handler)
- `.processcube/engine/config/` — Engine-Konfiguration (config.json)
- `.processcube/authority/config/` — Authority-Konfiguration und User-Seeding-Daten
- `processes/` — BPMN-Prozessdefinitionen (werden beim Engine-Start geseedet)
- `docs/` — Ausführliche Dokumentation mit Diagrammen
- `.claude/skills/` — Claude Code Skills (processcube-app-creator)

## Befehle

### Alle Services starten
```
docker compose up
```

### Nur Infrastruktur
```
docker compose up -d postgres engine authority whodb
```

### Docker-Images bauen
```
docker compose build                    # alle
docker compose build lowcode            # nur LowCode
docker compose build appsdk_sample      # nur AppSDK
```

### LowCode: Vue.js Dashboard-2-Widgets bauen (innerhalb von `apps/lowcode/src/`)
```
npm install
npm run build              # baut alle Widgets
npm run build:hello        # baut nur das ui-hello-Widget
npm run build:thermo       # baut nur das ui-thermo-Widget
```

### AppSDK: Next.js-App bauen (innerhalb von `apps/appsdk_sample/`)
```
npm install
npm run build
```

### Debugging (VSCode)
1. `docker compose up`
2. VSCode: Ausführen und Debuggen → "Attach to Node-RED" (Port 9229)
3. Breakpoints in `apps/lowcode/src/` setzen

Für Break-on-Start-Debugging die `--inspect-brk`-Zeile in `docker-compose.yml` einkommentieren.

## Konventionen

### LowCode
- **Dashboard-2-Widget-Pakete müssen** `node-red-dashboard-2-*` heißen und im `nodesDir` der Node-RED-Installation liegen.
- **Widget-Architektur**: Backend-Node.js-Modul registriert sich bei der Dashboard-2-Gruppe; Frontend-Vue.js-SFC-Komponente kommuniziert über Socket.io-Events.
- **External-Task-Pattern**: Custom-Nodes integrieren sich über External Tasks mit der Engine.
- **Flow-Speicherformat ist YAML** (`NODERED_FLOW_STORAGE_OUTPUT_FORMAT=yaml`).

### AppSDK
- **External Task Handler** als `app/{topic}/external_task.ts` — Verzeichnisname = BPMN-Topic.
- **Server Actions** nutzen `getEngineClient()` für Engine-Kommunikation (kein Auth-Session nötig).
- **next.config.ts** muss `require()`-Syntax verwenden und `serverExternalPackages: ['esbuild']` enthalten.
- **Dockerfile** benötigt `python3 make g++` im deps-Stage für native Module.
- **ProcessCube Studio Design System** wird über `globals.css` angewendet.
- **BPMN-Prozess-IDs** müssen mit `_Process` enden und ein korrektes `endEvent` haben.

### Docker
- **LowCode Dockerfile**: Symlink-Pattern statt `npm install` (pnpm workspace:* im Base-Image).
- **Engine Healthcheck**: Dateibasiert (`test -f /tmp/healthy`), kein curl.
- **Authority** hat bereits `externalTaskWorkers`-Config für AppSDK-Apps.

## CI/CD

GitHub-Actions-Workflow (`.github/workflows/build.yml`) wird bei Push auf `main` ausgelöst:
1. Extrahiert die Version aus der Root-`package.json` mittels `@5minds/product_ci_tools`
2. Baut ein Docker-Image (linux/amd64) und pusht es nach `ghcr.io/5minds/lowcode_apptemplate`

## Version

Die Root-`package.json` enthält die Projektversion (aktuell 0.10.0). Auf Root-Ebene sind keine npm-Scripts definiert — Build-Scripts befinden sich in den jeweiligen App-Verzeichnissen.

## Skills

- **processcube-app-creator** (`.claude/skills/`) — Skill zum Erstellen neuer Apps (AppSDK oder LowCode) mit Templates, Design System und Docker-Integration.

## Dokumentation

Ausführliche Dokumentation zu beiden App-Typen mit Architekturdiagrammen unter `docs/apps.md`.

## Claude Regeln

### Arbeitsablauf

1. **Analyse & Planung**
   - Durchdenke das Problem gründlich
   - Lies die relevanten Dateien der Codebasis
   - Erstelle einen Plan in `todos/<thema>/todo.md`
   - todos sollen auch immer commited werden

2. **Aufgabenliste**
   - Der Plan enthält eine Liste von Todo-Punkten
   - Hake sie beim Abarbeiten ab

3. **Abstimmung**
   - Bevor du beginnst, stimme dich mit mir ab
   - Ich prüfe den Plan

4. **Umsetzung**
   - Arbeite die Todo-Punkte ab
   - Markiere erledigte Aufgaben

5. **Kommunikation**
   - Gib bei jedem Schritt eine kurze Zusammenfassung der Änderungen

6. **Einfachheit**
   - Halte jede Aufgabe und Codeänderung so einfach wie möglich
   - Vermeide umfangreiche oder komplexe Änderungen
   - Jede Änderung soll so wenig Code wie möglich betreffen
   - Einfachheit ist das oberste Prinzip

7. **Review**
   - Füge am Ende einen Review-Abschnitt in `todos/<thema>/todo.md` hinzu
   - Fasse die Änderungen und relevante Informationen zusammen

### Grundsätze

- **Keine Faulheit.** Du bist ein Senior Developer. Finde bei Bugs die Ursache und behebe sie richtig. Keine temporären Fixes.

- **Maximale Einfachheit.** Alle Änderungen betreffen nur den notwendigen Code. Das Ziel ist, keine neuen Bugs einzuführen. Einfachheit über alles.

- **Dateiberechtigungen.** Neue Dateien müssen für Gruppe und andere lesbar sein. Nach dem Erstellen von Dateien: `chmod go+r <datei>`. Bei Verzeichnissen zusätzlich: `chmod go+x <verzeichnis>`.

- **Kein automatisches Commit/Push.** Niemals selbstständig committen oder pushen. Nur auf explizite Anweisung des Benutzers.
