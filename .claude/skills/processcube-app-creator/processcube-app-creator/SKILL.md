---
name: processcube-app-creator
description: "Create new ProcessCube example apps within the AppTemplate project. Supports two app types: LowCode (Node-RED with custom nodes/widgets) and AppSDK (Next.js with External Tasks and UserTasks). Use when the user wants to create a new app, add an app to the template, scaffold a ProcessCube application, or says 'neue App erstellen'. Always includes Engine, Authority, Postgres, and WhoDB infrastructure."
---

# ProcessCube App Creator

Create new apps under `apps/` in the ProcessCube.AppTemplate project.

## Workflow

### 1. Ask the user

- **App name** (used for directory, docker service, topic prefix)
- **App type**: `appsdk` (Next.js) or `lowcode` (Node-RED)

### 2. Choose template

- **AppSDK**: Read [references/appsdk-template.md](references/appsdk-template.md) and [references/design-system.md](references/design-system.md)
- **LowCode**: Read [references/lowcode-template.md](references/lowcode-template.md)
- **Docker Compose**: Read [references/docker-compose.md](references/docker-compose.md) for service patterns

### 3. Create the app

Replace all `{app_name}` and `{topic_name}` placeholders with the user's app name.

#### AppSDK app

1. Create all files under `apps/{app_name}/` per appsdk-template.md
2. Apply ProcessCube Studio Design System (globals.css from design-system.md)
3. Create example External Task handler at `app/{app_name}_greeting/external_task.ts`
4. Create example BPMN process at `processes/{AppName}.bpmn` with:
   - StartEvent → UserTask (input) → External Task → UserTask (result) → EndEvent
   - Process ID: `{AppName}_Process`
5. Create `public/` directory (empty)
6. Add service to `docker-compose.yml` with configurable port variable `{APP_NAME_UPPER}_PORT`
7. Run `chmod go+r` on all new files, `chmod go+x` on directories

#### LowCode app

1. Create all files under `apps/{app_name}/` per lowcode-template.md
2. Create example Node-RED node with External Task integration
3. Create example BPMN process at `processes/{AppName}.bpmn`
4. Add service to `docker-compose.yml`
5. Run `chmod go+r` on all new files, `chmod go+x` on directories

### 4. Verify

1. Run `npm install` in the app directory
2. Run `npm run build` to verify no errors
3. Run `docker compose build {app_name}` to verify Docker build

### 5. Report

Summarize:
- Created files
- Docker service name and port
- BPMN process name
- How to start: `docker compose up -d`

## Key Rules

- Engine, Authority, Postgres, WhoDB are always part of the docker-compose (already present in AppTemplate)
- Authority already has `externalTaskWorkers` config — no changes needed
- BPMN process ID must end with `_Process` and have a proper `endEvent`
- AppSDK: Use `getEngineClient()` for engine calls, not SDK wrapper functions that need auth sessions
- AppSDK: Use `require()` syntax in next.config.ts, not ESM `import`
- AppSDK: Include `serverExternalPackages: ['esbuild']` in next config
- AppSDK: Dockerfile needs `python3 make g++` for native module compilation
- LowCode: Use symlink pattern in Dockerfile (npm install doesn't work with pnpm workspace)
- Use existing `apps/appsdk_sample/` and `apps/lowcode/` as working reference implementations
