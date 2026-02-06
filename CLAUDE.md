# CLAUDE.md

Diese Datei bietet Claude Code (claude.ai/code) Orientierung bei der Arbeit mit dem Code in diesem Repository.

## Projektübersicht

ProcessCube.AppTemplate ist ein Template zur Entwicklung eigener Node-RED-Nodes, Plugins und Dashboard-2-Widgets, die in die ProcessCube-Plattform integriert werden. Das Projekt ist in JavaScript geschrieben (TypeScript-Version geplant) und verwendet Vue.js für Dashboard-Widgets.

## Architektur

Vier Docker-Services bilden die Plattform:

- **engine** (Port 8000) — ProcessCube BPMN-Workflow-Engine mit PostgreSQL-Backend
- **authority** (Port 11560) — OAuth2/OIDC-Identity-Provider
- **postgres** (Port 5432, dynamisches externes Mapping) — PostgreSQL 17, gemeinsam genutzt von Engine und Authority
- **lowcode** (Port 1880, Debug-Port 9229) — Node-RED mit Custom-Nodes/-Widgets, gebaut aus `apps/lowcode/Dockerfile`

Der Lowcode-Service hängt von Engine ab (Healthcheck), die wiederum von Postgres abhängt (Healthcheck). Authority läuft unabhängig.

## Wichtige Verzeichnisse

- `apps/lowcode/src/` — Alle Custom-Node-RED-Nodes, Plugins und Vue.js-Widgets
- `apps/lowcode/src/nodes/` — Node-RED-Node-Implementierungen (JS- + HTML-Paare)
- `apps/lowcode/src/ui/` — Vue.js-Komponenten und Vite-Export-Einträge für Dashboard-2-Widgets
- `.processcube/engine/config/` — Engine-Konfiguration (config.json)
- `.processcube/authority/config/` — Authority-Konfiguration und User-Seeding-Daten
- `processes/` — BPMN-Prozessdefinitionen (werden beim Start in die Engine geladen)

## Befehle

### Alle Services starten
```
docker compose up
```

### Lowcode-Docker-Image bauen
```
docker compose build
```

### Vue.js Dashboard-2-Widgets bauen (innerhalb von `apps/lowcode/src/`)
```
npm install
npm run build              # baut alle Widgets
npm run build:hello        # baut nur das ui-hello-Widget
npm run build:thermo       # baut nur das ui-thermo-Widget
```

### Debugging (VSCode)
1. `docker compose up`
2. VSCode: Ausführen und Debuggen → "Attach to Node-RED" (Port 9229)
3. Breakpoints in `apps/lowcode/src/` setzen

Für Break-on-Start-Debugging die `--inspect-brk`-Zeile in `docker-compose.yml` (Zeile ~78) einkommentieren.

## Konventionen

- **Dashboard-2-Widget-Pakete müssen** `node-red-dashboard-2-*` heißen und im `nodesDir` der Node-RED-Installation liegen, damit sie korrekt geladen werden.
- **Widget-Architektur**: Backend-Node.js-Modul registriert sich bei der Dashboard-2-Gruppe; Frontend-Vue.js-SFC-Komponente kommuniziert über Socket.io-Events (`widget-action`, `widget-change`).
- **Jedes Widget benötigt**: einen Vite-Build-Eintrag in `ui/exports/`, eine Vue-Komponente in `ui/components/`, ein Node.js-Backend in `nodes/` und eine Registrierung in `package.json` unter `node-red.nodes` und `node-red-dashboard-2.widgets`.
- **External-Task-Pattern**: Custom-Nodes integrieren sich über External Tasks mit der ProcessCube Engine (siehe `nodes/sample_node/hello.js` und `processes/Sample_With_Custome_Node.bpmn`).
- **Flow-Speicherformat ist YAML** (`NODERED_FLOW_STORAGE_OUTPUT_FORMAT=yaml`).

## CI/CD

GitHub-Actions-Workflow (`.github/workflows/build.yml`) wird bei Push auf `main` ausgelöst:
1. Extrahiert die Version aus der Root-`package.json` mittels `@5minds/product_ci_tools`
2. Baut ein Docker-Image (linux/amd64) und pusht es nach `ghcr.io/5minds/lowcode_apptemplate`

## Version

Die Root-`package.json` enthält die Projektversion (aktuell 0.9.4). Auf Root-Ebene sind keine npm-Scripts definiert — Build-Scripts befinden sich in `apps/lowcode/src/package.json`.

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
