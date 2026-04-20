# Apps im ProcessCube.AppTemplate

Dieses Dokument beschreibt die zwei App-Typen, die im ProcessCube.AppTemplate erstellt werden können: **LowCode** (Node-RED) und **AppSDK** (Next.js).

---

## Plattform-Architektur

Beide App-Typen nutzen dieselbe Infrastruktur:

```mermaid
graph TB
    subgraph Docker Compose
        subgraph Infrastruktur
            PG[(PostgreSQL<br/>Port 5432)]
            AUTH[Authority<br/>OAuth2/OIDC<br/>Port 11560]
            ENGINE[Engine<br/>BPMN Workflow<br/>Port 8000]
            WHODB[WhoDB<br/>DB-Verwaltung<br/>Port 8080]
        end

        subgraph Apps
            LC[LowCode<br/>Node-RED<br/>Port 1880]
            SDK[AppSDK<br/>Next.js<br/>Port 3000]
        end
    end

    PG --> AUTH
    PG --> ENGINE
    PG --> WHODB
    ENGINE --> AUTH
    LC --> ENGINE
    LC --> AUTH
    SDK --> ENGINE
    SDK --> AUTH

    style ENGINE fill:#f8b544,stroke:#e4a130,color:#1f2937
    style AUTH fill:#3b82f6,stroke:#2563eb,color:#fff
    style PG fill:#374151,stroke:#4b5563,color:#e5e7eb
    style LC fill:#e8f5e9,stroke:#16a34a,color:#1f2937
    style SDK fill:#e3f2fd,stroke:#2563eb,color:#1f2937
```

### Dienste

| Dienst | Image | Port | Funktion |
|--------|-------|------|----------|
| **postgres** | `processcube.postgres:0.2.1` | 5432 | PostgreSQL 18, erstellt automatisch `engine`, `authority`, `appdb` |
| **engine** | `processcube_engine:20.1.1` | 8000 | BPMN-Workflow-Engine, verwaltet Prozesse und Tasks |
| **authority** | `processcube_authority:3.5.2` | 11560 | OAuth2/OIDC Identity Provider |
| **whodb** | `clidey/whodb:latest` | 8080 | Web-basierte Datenbankverwaltung |

---

## LowCode-App (Node-RED)

### Überblick

Die LowCode-App basiert auf **Node-RED** und ermöglicht die visuelle Programmierung von Workflows. Custom Nodes und Dashboard-Widgets werden als npm-Pakete entwickelt und in das Node-RED-Image integriert.

### Installation

```bash
# 1. Repository klonen
git clone https://github.com/5minds/ProcessCube.AppTemplate.git
cd ProcessCube.AppTemplate

# 2. Abhängigkeiten installieren (im src-Verzeichnis)
cd apps/lowcode/src
npm install

# 3. Widgets bauen
npm run build

# 4. Docker-Image bauen und starten
cd ../../..
docker compose build lowcode
docker compose up -d
```

Node-RED ist erreichbar unter: **http://localhost:1880**

### Aufbau

```mermaid
graph LR
    subgraph "apps/lowcode/"
        subgraph "src/"
            subgraph "nodes/"
                N1[hello.js<br/>hello.html]
                N2[form_context.js]
                N3[sample_plugin.js]
            end
            subgraph "ui/components/"
                C1[Hello.vue]
                C2[Thermo.vue]
            end
            subgraph "ui/exports/"
                E1[ui-hello.js]
                E2[ui-thermo.js]
            end
            PKG[package.json<br/>Node + Widget<br/>Registrierung]
            VITE[vite.config.js]
        end
        DATA[data/<br/>Flows, Credentials]
        DF[Dockerfile]
    end

    PKG --> N1
    PKG --> N2
    PKG --> N3
    PKG --> E1
    PKG --> E2
    E1 --> C1
    E2 --> C2
    VITE --> E1
    VITE --> E2

    style PKG fill:#f8b544,stroke:#e4a130,color:#1f2937
    style DF fill:#374151,stroke:#4b5563,color:#e5e7eb
```

#### Verzeichnisstruktur

```
apps/lowcode/
├── src/
│   ├── nodes/                    # Node-RED Node-Implementierungen
│   │   ├── sample_node/
│   │   │   ├── hello.js          # Backend: External Task Worker
│   │   │   └── hello.html        # Editor: Node-Konfiguration
│   │   ├── form_context/
│   │   │   └── form_context.js   # Formular-Kontext-Node
│   │   └── aplugin/
│   │       └── sample_plugin.js  # Plugin mit HTTP-Endpunkt
│   ├── ui/
│   │   ├── components/           # Vue.js Dashboard-Widgets
│   │   │   ├── Hello.vue         # Hello-World Widget
│   │   │   └── Thermo.vue        # Thermometer Widget
│   │   └── exports/              # Vite Build-Einträge
│   │       ├── ui-hello.js
│   │       └── ui-thermo.js
│   ├── package.json              # Node/Widget-Registrierung + Scripts
│   ├── vite.config.js            # Build-Konfiguration
│   └── custom_settings.js        # Node-RED Einstellungen
├── data/                         # Persistente Node-RED-Daten
└── Dockerfile                    # Basiert auf processcube_lowcode
```

#### Komponentenarten

| Typ | Verzeichnis | Beschreibung |
|-----|-------------|-------------|
| **Custom Node** | `nodes/` | JS-Backend + HTML-Editor, integriert mit Engine via External Tasks |
| **Dashboard Widget** | `ui/components/` | Vue.js SFC, kommuniziert via Socket.io |
| **Plugin** | `nodes/` | Stellt HTTP-Endpunkte bereit (z.B. REST API) |

### Ablauf

#### Dockerfile-Build

```mermaid
sequenceDiagram
    participant Dev as Entwickler
    participant Docker as Docker Build
    participant Base as Base Image<br/>processcube_lowcode:7.9.0
    participant NR as Node-RED

    Dev->>Docker: docker compose build lowcode
    Docker->>Base: FROM processcube_lowcode:7.9.0
    Docker->>Docker: COPY ./src → /package_src/
    Docker->>Docker: npm install + npm run build
    Note over Docker: Vite baut Vue-Widgets<br/>zu UMD-Bundles
    Docker->>Docker: Symlink: node_modules/{package} → /package_src/
    Note over Docker: npm install funktioniert nicht<br/>(pnpm workspace:* im Base-Image)
    Docker-->>Dev: Image fertig
    Dev->>NR: docker compose up
    NR->>NR: Lädt Nodes + Widgets aus node_modules
```

#### External Task Integration

```mermaid
sequenceDiagram
    participant User as Benutzer
    participant NR as Node-RED<br/>LowCode
    participant Engine as ProcessCube<br/>Engine
    participant BPMN as BPMN-Prozess

    User->>NR: Flow im Editor erstellen
    NR->>Engine: External Task Worker registrieren
    Note over NR,Engine: Long-Polling auf Topic

    User->>Engine: Prozessinstanz starten
    Engine->>BPMN: Start → Service Task (External)
    BPMN->>Engine: External Task erstellen
    Engine-->>NR: Task zuweisen (Fetch & Lock)
    NR->>NR: Node verarbeitet Task
    NR-->>Engine: Ergebnis zurückmelden
    Engine->>BPMN: Weiter im Prozess
```

### Debugging

1. `docker compose up` starten
2. VSCode: **Ausführen und Debuggen → "Attach to Node-RED"** (Port 9229)
3. Breakpoints in `apps/lowcode/src/` setzen

Für Break-on-Start: `NODE_OPTIONS=--inspect-brk=0.0.0.0:9229` in der docker-compose einkommentieren.

---

## AppSDK-App (Next.js)

### Überblick

Die AppSDK-App basiert auf **Next.js 15** mit dem **ProcessCube App SDK**. Sie bietet eine moderne Web-Oberfläche für BPMN-Prozesse mit automatischem External Task Worker Management und UserTask-Formularen.

### Installation

```bash
# 1. Repository klonen (falls noch nicht geschehen)
git clone https://github.com/5minds/ProcessCube.AppTemplate.git
cd ProcessCube.AppTemplate

# 2. Abhängigkeiten installieren
cd apps/appsdk_sample
npm install

# 3. App bauen
npm run build

# 4. Docker-Image bauen und starten
cd ../..
docker compose build appsdk_sample
docker compose up -d
```

Die App ist erreichbar unter: **http://localhost:3000** (oder `APPSDK_SAMPLE_PORT`)

### Aufbau

```mermaid
graph TB
    subgraph "apps/appsdk_sample/"
        subgraph "app/"
            LAYOUT[layout.tsx<br/>Root Layout]
            CSS[globals.css<br/>Design System]
            PAGE[page.tsx<br/>Single-Page UI]
            ACTIONS[actions.ts<br/>Server Actions]
            subgraph "appsdk_greeting/"
                ETW[external_task.ts<br/>External Task Handler]
            end
        end
        CONFIG[next.config.ts<br/>withApplicationSdk]
        PKG[package.json]
        ENV[.env.local]
        DF[Dockerfile]
    end

    LAYOUT --> CSS
    LAYOUT --> PAGE
    PAGE --> ACTIONS
    CONFIG --> ETW
    ACTIONS -.->|getEngineClient| ENGINE[(Engine)]

    style PAGE fill:#f8b544,stroke:#e4a130,color:#1f2937
    style ACTIONS fill:#3b82f6,stroke:#2563eb,color:#fff
    style ETW fill:#e8f5e9,stroke:#16a34a,color:#1f2937
    style CONFIG fill:#374151,stroke:#4b5563,color:#e5e7eb
```

#### Verzeichnisstruktur

```
apps/appsdk_sample/
├── app/
│   ├── globals.css                  # ProcessCube Studio Design System
│   ├── layout.tsx                   # Root Layout (importiert CSS)
│   ├── page.tsx                     # Single-Page App (Menü + Tasks + Formular)
│   ├── actions.ts                   # Server Actions (Engine-Kommunikation)
│   ├── tasks/                       # (Legacy-Seite, kann entfernt werden)
│   │   ├── page.tsx
│   │   └── task-list.tsx
│   ├── usertask/[id]/               # (Legacy-Seite, kann entfernt werden)
│   │   └── page.tsx
│   └── appsdk_greeting/
│       └── external_task.ts         # External Task Handler (Topic: appsdk_greeting)
├── public/                          # Statische Assets
├── .env.local                       # Umgebungsvariablen (Docker-Netzwerk)
├── .env.local.example               # Vorlage für Umgebungsvariablen
├── .dockerignore                    # Excludes: node_modules, .next, .env.local
├── Dockerfile                       # Multi-Stage Build (deps → builder → runner)
├── next.config.ts                   # AppSDK Plugin + esbuild
├── package.json                     # Next.js 15 + AppSDK + React 19
└── tsconfig.json                    # TypeScript (ES2024, bundler)
```

#### Schlüsselkomponenten

| Datei | Funktion |
|-------|----------|
| **next.config.ts** | `withApplicationSdk()` aktiviert External Task Worker, `serverExternalPackages: ['esbuild']` |
| **actions.ts** | Server Actions nutzen `getEngineClient()` für Prozess-Start, Task-Abfrage, Task-Abschluss |
| **page.tsx** | Client Component mit Polling (3s), Menü, Task-Liste, UserTask-Formular |
| **external_task.ts** | Handler-Funktion, Verzeichnisname = BPMN-Topic |
| **globals.css** | ProcessCube Studio Design System (Gold-Akzent, System-Fonts, CSS Variables) |

### Ablauf

#### App-Startup und Worker-Registrierung

```mermaid
sequenceDiagram
    participant Docker as Docker Compose
    participant App as Next.js App
    participant SDK as AppSDK Plugin
    participant Worker as ETW Process
    participant Auth as Authority
    participant Engine as Engine

    Docker->>App: npm start
    App->>SDK: withApplicationSdk()
    SDK->>SDK: Scanne app/ nach external_task.ts
    SDK->>SDK: Finde: appsdk_greeting/external_task.ts
    SDK->>Auth: Client Credentials Grant
    Auth-->>SDK: Access Token (engine_etw Scope)
    SDK->>Worker: Fork Child Process (Topic: appsdk_greeting)
    Worker->>Engine: HTTP Long-Polling (Fetch & Lock)
    Note over Worker,Engine: Wartet auf Tasks<br/>für Topic "appsdk_greeting"
    App-->>Docker: Ready on Port 3000
```

#### Prozess-Durchlauf (Greeting-Beispiel)

```mermaid
sequenceDiagram
    participant User as Benutzer<br/>(Browser)
    participant App as Next.js<br/>Server Action
    participant Engine as ProcessCube<br/>Engine
    participant Worker as External Task<br/>Worker

    User->>App: Klick "Prozess starten"
    App->>Engine: startProcessInstance<br/>(SampleWithAppSDK_Process)
    Engine->>Engine: Start → UserTask<br/>"Begrüssung eingeben"

    Note over User,Engine: UserTask 1: Eingabe

    User->>App: Polling: fetchWaitingUserTasks()
    App->>Engine: query(state: suspended)
    Engine-->>App: UserTask "Begrüssung eingeben"
    App-->>User: Task-Karte anzeigen

    User->>User: Klick auf Task → Formular
    User->>App: Eingabe: "Hallo ProcessCube!"
    App->>Engine: finishUserTask(id, {greeting: "Hallo ProcessCube!"})

    Note over Engine,Worker: External Task: Greeting

    Engine->>Engine: UserTask fertig → Service Task
    Engine-->>Worker: External Task (Topic: appsdk_greeting)
    Worker->>Worker: payload.greeting → greeting_back
    Worker-->>Engine: {greeting_back: 'Antwort auf "Hallo ProcessCube!": ...'}

    Note over User,Engine: UserTask 2: Ergebnis

    Engine->>Engine: Service Task fertig → UserTask<br/>"Begrüssung bekommen"
    User->>App: Polling: fetchWaitingUserTasks()
    App-->>User: Task "Begrüssung bekommen"<br/>mit greeting_back vorausgefüllt
    User->>App: Klick "Abschließen"
    App->>Engine: finishUserTask(id, {...})
    Engine->>Engine: UserTask fertig → EndEvent ✓
```

#### UI-Architektur (Single-Page)

```mermaid
stateDiagram-v2
    [*] --> TaskListe: App laden

    TaskListe --> TaskListe: Polling alle 3s
    TaskListe --> TaskDetail: Task anklicken
    TaskListe --> TaskListe: "Prozess starten"<br/>→ startSampleProcess()

    TaskDetail --> TaskListe: "Zurück"
    TaskDetail --> TaskListe: "Abschließen"<br/>→ completeUserTask()

    state TaskListe {
        [*] --> Leer: Keine Tasks
        [*] --> Liste: Tasks vorhanden
        Leer --> Liste: Neuer Task erscheint
        Liste --> Leer: Letzter Task abgeschlossen
    }

    state TaskDetail {
        [*] --> Formular: FormFields laden
        Formular --> Absenden: Submit
    }
```

### Dockerfile-Build

```mermaid
graph LR
    subgraph "Stage 1: deps"
        D1[node:24-alpine]
        D2[apk add python3 make g++]
        D3[npm install]
    end

    subgraph "Stage 2: builder"
        B1[COPY node_modules]
        B2[COPY source]
        B3[npm run build]
    end

    subgraph "Stage 3: runner"
        R1[node_modules]
        R2[.next/]
        R3[app/]
        R4["npm start"]
    end

    D1 --> D2 --> D3
    D3 --> B1
    B1 --> B2 --> B3
    D3 --> R1
    B3 --> R2
    B3 --> R3
    R1 & R2 & R3 --> R4

    style D2 fill:#ea580c,stroke:#c2410c,color:#fff
    style B3 fill:#f8b544,stroke:#e4a130,color:#1f2937
    style R4 fill:#16a34a,stroke:#15803d,color:#fff
```

**Hinweis**: `python3`, `make` und `g++` werden nur im `deps`-Stage benötigt (für native Module wie `utf-8-validate` via node-gyp). Das finale Runner-Image enthält sie nicht.

---

## Vergleich der App-Typen

| Aspekt | LowCode (Node-RED) | AppSDK (Next.js) |
|--------|--------------------|--------------------|
| **Zielgruppe** | Citizen Developer, Low-Code | Professionelle Entwickler |
| **UI-Erstellung** | Visueller Flow-Editor + Dashboard-2 | React/TypeScript Code |
| **External Tasks** | Node-RED Nodes (JS) | Datei-basiert (`external_task.ts`) |
| **UserTasks** | Dashboard-2 Widgets (Vue.js) | Server Actions + React Forms |
| **Deployment** | Docker (processcube_lowcode Base) | Docker (node:24-alpine) |
| **Hot-Reload** | Node-RED Editor | AppSDK Datei-Watcher |
| **Debugging** | VSCode Attach (Port 9229) | Standard Next.js Dev Tools |
| **Styling** | Dashboard-2 Theme | ProcessCube Studio Design System |

```mermaid
graph LR
    subgraph "Gemeinsame Plattform"
        ENGINE[ProcessCube Engine]
        AUTH[Authority]
        PG[(PostgreSQL)]
        BPMN[BPMN-Prozesse]
    end

    subgraph "LowCode-Weg"
        NR[Node-RED Editor]
        DASH[Dashboard-2<br/>Vue.js Widgets]
        FLOW[Visuelle Flows]
    end

    subgraph "AppSDK-Weg"
        NEXT[Next.js App]
        REACT[React UI<br/>Design System]
        CODE[TypeScript Code]
    end

    NR --> ENGINE
    NEXT --> ENGINE
    ENGINE --> BPMN
    ENGINE --> PG
    ENGINE --> AUTH

    style ENGINE fill:#f8b544,stroke:#e4a130,color:#1f2937
    style NR fill:#e8f5e9,stroke:#16a34a
    style NEXT fill:#e3f2fd,stroke:#2563eb
```

---

## Schnellstart

### Nur Infrastruktur starten

```bash
docker compose up -d postgres engine authority whodb
```

### Mit LowCode-App

```bash
docker compose up -d
# → Node-RED: http://localhost:1880
```

### Mit AppSDK-App

```bash
APPSDK_SAMPLE_PORT=3000 docker compose up -d
# → AppSDK: http://localhost:3000
```

### Alles zusammen

```bash
APPSDK_SAMPLE_PORT=3003 docker compose up -d
# → Node-RED:  http://localhost:1880
# → AppSDK:    http://localhost:3003
# → Engine:    http://localhost:8000
# → Authority: http://localhost:11560
# → WhoDB:     http://localhost:8080
```
