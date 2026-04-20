# ProcessCube.AppTemplate

Template zur Entwicklung eigener Apps für die ProcessCube-Plattform. Unterstützt zwei App-Typen:

| App-Typ | Technologie | Zielgruppe | Verzeichnis |
|---------|-------------|------------|-------------|
| **LowCode** | Node-RED + Vue.js | Citizen Developer | `apps/lowcode/` |
| **AppSDK** | Next.js 15 + React 19 | Professionelle Entwickler | `apps/appsdk_sample/` |

## Schnellstart

```bash
# Repository klonen
git clone https://github.com/5minds/ProcessCube.AppTemplate.git
cd ProcessCube.AppTemplate

# Alle Services starten
docker compose up

# Oder mit benutzerdefiniertem Port für AppSDK
APPSDK_SAMPLE_PORT=3003 docker compose up
```

### Erreichbare Dienste

| Dienst | URL | Beschreibung |
|--------|-----|-------------|
| Node-RED (LowCode) | http://localhost:1880 | Visueller Flow-Editor + Dashboard |
| AppSDK Sample | http://localhost:3000 | Next.js App mit UserTasks |
| Engine | http://localhost:8000 | BPMN-Workflow-Engine |
| Authority | http://localhost:11560 | OAuth2/OIDC Identity Provider |
| WhoDB | http://localhost:8080 | Web-basierte DB-Verwaltung |

## Architektur

```
┌─────────────────────────────────────────────────────┐
│                  Docker Compose                      │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ LowCode  │  │ AppSDK   │  │    Infrastruktur   │  │
│  │ Node-RED │  │ Next.js  │  │                    │  │
│  │ :1880    │  │ :3000    │  │  Engine    :8000   │  │
│  └────┬─────┘  └────┬─────┘  │  Authority :11560  │  │
│       │              │        │  Postgres  :5432   │  │
│       └──────┬───────┘        │  WhoDB     :8080   │  │
│              ▼                │                    │  │
│        ProcessCube            └───────────────────┘  │
│          Engine                                      │
└─────────────────────────────────────────────────────┘
```

## LowCode-App (Node-RED)

Custom-Nodes, Plugins und Dashboard-2-Widgets für Node-RED:

- **Custom-Plugin**: `apps/lowcode/src/nodes/aplugin/`
- **Custom-Node** (External Task): `apps/lowcode/src/nodes/sample_node/`
- **Dashboard-2-Widgets** (Vue.js): `apps/lowcode/src/ui/components/`

```bash
# Widgets bauen
cd apps/lowcode/src
npm install && npm run build

# Docker-Image bauen
docker compose build lowcode
```

### Debugging

1. `docker compose up`
2. VSCode: **Run and Debug** → **Attach to Node-RED** (Port 9229)
3. Breakpoints in `apps/lowcode/src/` setzen

## AppSDK-App (Next.js)

Moderne Web-App mit ProcessCube AppSDK, External Tasks und UserTasks:

- **External Task Handler**: `apps/appsdk_sample/app/appsdk_greeting/external_task.ts`
- **Server Actions**: `apps/appsdk_sample/app/actions.ts`
- **UI** (React): `apps/appsdk_sample/app/page.tsx`
- **Design System**: ProcessCube Studio (Gold-Akzent, System-Fonts)

```bash
# App bauen
cd apps/appsdk_sample
npm install && npm run build

# Docker-Image bauen
docker compose build appsdk_sample
```

### Beispielprozess

Der BPMN-Prozess `SampleWithAppSDK` demonstriert den vollständigen Ablauf:

```
Start → UserTask (Eingabe) → External Task (Verarbeitung) → UserTask (Ergebnis) → Ende
```

## BPMN-Prozesse

Prozessdefinitionen unter `processes/` werden beim Engine-Start automatisch geladen:

| Prozess | Datei | Beschreibung |
|---------|-------|-------------|
| Sample_With_Custome_Node | `.bpmn` | LowCode External Task Beispiel |
| AppSDK_Sample | `.bpmn` | Einfacher External Task |
| SampleWithAppSDK | `.bpmn` | UserTasks + External Task |

## Dokumentation

Ausführliche Dokumentation mit Architekturdiagrammen: **[docs/apps.md](docs/apps.md)**

## Neue App erstellen

Der Claude Code Skill **processcube-app-creator** (`.claude/skills/`) unterstützt beim Erstellen neuer Apps:

- Fragt nach App-Name und Typ (AppSDK / LowCode)
- Generiert alle Dateien aus Templates
- Konfiguriert Docker Compose Service
- Erstellt Beispiel-BPMN-Prozess

## Image-Versionen

| Image | Version |
|-------|---------|
| ProcessCube Engine | `20.1.1` |
| ProcessCube Authority | `3.5.2` |
| ProcessCube LowCode | `7.9.0` |
| ProcessCube Postgres | `0.2.1` |

## Roadmap

- [x] JavaScript LowCode-Version
- [x] npm-Packages im Docker-Image
- [x] Plugin für Node-RED
- [x] Beispiel-Node mit External Task
- [x] Dashboard-2 Widgets (Vue.js)
- [x] Debugging mit VSCode
- [x] GitHub Actions Workflow
- [x] AppSDK-Beispielapp (Next.js)
- [x] UserTask-Integration
- [x] ProcessCube Studio Design System
- [x] App-Creator Skill
- [ ] TypeScript-Version für LowCode
