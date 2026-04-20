# AppSDK App Template Reference

## Directory Structure

```
apps/{app_name}/
├── app/
│   ├── globals.css              # ProcessCube Studio Design System
│   ├── layout.tsx               # Root layout (imports globals.css)
│   ├── page.tsx                 # Single-page app (menu, task list, usertask form)
│   ├── actions.ts               # Server actions (start process, fetch/complete tasks)
│   └── {topic_name}/
│       └── external_task.ts     # External Task handler
├── .dockerignore                # node_modules, .next, .env.local
├── .env.local                   # Engine/Authority URLs for Docker network
├── .env.local.example           # Template for env vars
├── Dockerfile                   # Multi-stage Next.js build
├── next.config.ts               # withApplicationSdk plugin
├── package.json                 # Dependencies
├── public/                      # Static assets (empty)
└── tsconfig.json                # TypeScript config
```

## package.json

```json
{
  "name": "{app_name}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@5minds/processcube_app_sdk": "^8.4.0",
    "next": "^15.3.0",
    "next-auth": "~4.24.12",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@types/node": "^24",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "typescript": "^5.8.3"
  }
}
```

## next.config.ts

```typescript
const { withApplicationSdk } = require('@5minds/processcube_app_sdk/server');

module.exports = withApplicationSdk({
  serverExternalPackages: ['esbuild'],
  applicationSdk: {
    useExternalTasks: true,
  },
});
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2024",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["**/*.ts", "**/*.tsx", "next-env.d.ts", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## .env.local (Docker network)

```
PROCESSCUBE_ENGINE_URL=http://engine:8000
PROCESSCUBE_AUTHORITY_URL=http://authority:11560
PROCESSCUBE_EXTERNAL_TASK_WORKER_CLIENT_ID=external_task_worker
PROCESSCUBE_EXTERNAL_TASK_WORKER_CLIENT_SECRET=external_task_worker_secret
```

## .env.local.example (local development)

```
PROCESSCUBE_ENGINE_URL=http://localhost:8000
PROCESSCUBE_AUTHORITY_URL=http://localhost:11560
PROCESSCUBE_EXTERNAL_TASK_WORKER_CLIENT_ID=external_task_worker
PROCESSCUBE_EXTERNAL_TASK_WORKER_CLIENT_SECRET=external_task_worker_secret
```

## Dockerfile

```dockerfile
FROM node:24-alpine AS base

FROM base AS deps
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json ./
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/app ./app

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
```

## .dockerignore

```
node_modules
.next
.env.local
```

## External Task Handler Pattern

File: `app/{topic_name}/external_task.ts`
The directory name becomes the BPMN topic automatically.

```typescript
export default async function handleExternalTask(payload: any) {
  // Process payload from BPMN process token
  // Return result that gets merged into the process token
  return { result_field: 'value' };
}
```

## Server Actions (actions.ts)

Use `getEngineClient()` for all engine interactions (no auth session needed):

```typescript
'use server';
import { getEngineClient } from '@5minds/processcube_app_sdk/server';

function engine() { return getEngineClient(); }

export async function startProcess(processModelId: string) {
  await engine().processModels.startProcessInstance({
    processModelId, startEventId: 'StartEvent_1', initialToken: {},
  });
}

export async function fetchWaitingUserTasks() {
  const result = await engine().userTasks.query({ state: 'suspended' as any });
  return result?.userTasks ?? [];
}

export async function fetchUserTaskById(id: string) {
  const tasks = await fetchWaitingUserTasks();
  return tasks.find((t: any) => t.flowNodeInstanceId === id) ?? null;
}

export async function completeUserTask(id: string, result: Record<string, any>) {
  await engine().userTasks.finishUserTask(id, result as any);
}
```

## Single-Page UI Pattern (page.tsx)

Client component with:
- Menu bar: App name, "Prozess starten", "Wartende UserTasks"
- Content: Task list (polls every 3s) or UserTask form
- Status bar: Worker status, task count
- Uses ProcessCube Studio Design System via globals.css

## BPMN Process Pattern

- Process ID must end with `_Process` (e.g., `{AppName}_Process`)
- Must have a proper `endEvent` (not `intermediateThrowEvent`)
- UserTask form fields via `camunda:formData` / `camunda:formField`
- External Task topics match directory name in `app/`
- Default values from token: `defaultValue="${token.current.field_name}"`
