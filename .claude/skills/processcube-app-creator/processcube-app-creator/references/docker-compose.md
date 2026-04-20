# Docker Compose Infrastructure Reference

## Base Services (always included)

### Engine

```yaml
engine:
  image: ghcr.io/5minds/processcube_engine:20.1.1
  depends_on:
    postgres:
      condition: service_healthy
  ports:
    - 8000:8000
  volumes:
    - ./.processcube/engine/config:/etc/engine/config:ro
    - ./processes:/processes:ro
  environment:
    - CONFIG_PATH=/etc/engine/config/config.json
    - database__dialect=postgres
    - database__host=postgres
    - database__port=5432
    - database__username=postgres
    - database__password=postgres
    - database__database=engine
    - application__name=Engine (ProcessCube.AppTemplate)
  command: --seed-dir=/processes
  healthcheck:
    test: ["CMD", "test", "-f", "/tmp/healthy"]
    interval: 5s
    retries: 10
    timeout: 10s
```

### Authority

```yaml
authority:
  image: ghcr.io/5minds/processcube_authority:3.5.2
  depends_on:
    postgres:
      condition: service_healthy
  ports:
    - 11560:11560
  volumes:
    - ./.processcube/authority/config:/etc/authority/config:ro
  environment:
    - UPE_SEED_PATH=/etc/authority/config/upeSeedingData.json
    - database__dialect=postgres
    - database__host=postgres
    - database__port=5432
    - database__username=postgres
    - database__password=postgres
    - database__database=authority
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:11560/.well-known/openid-configuration"]
    interval: 5s
    retries: 10
    timeout: 10s
```

### Postgres

```yaml
postgres:
  image: ghcr.io/processcube-io/processcube.postgres:0.2.1
  environment:
    POSTGRES_USER: ${POSTGRES_USER:-postgres}
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
    INIT_PROCESSCUBE_DBS: "true"
  volumes:
    - ./postgres/apptemplate_db.instance:/var/lib/postgresql
  ports:
    - 5432
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres}"]
    interval: 10s
    timeout: 5s
    retries: 5
    start_period: 30s
  restart: unless-stopped
```

### WhoDB

```yaml
whodb:
  image: clidey/whodb:latest
  restart: unless-stopped
  ports:
    - "${WHODB_PORT:-8080}:8080"
  environment:
    WHODB_DATABASES: |
      [
        { "name": "Engine", "type": "postgres", "connection": "postgresql://postgres:postgres@postgres:5432/engine" },
        { "name": "Authority", "type": "postgres", "connection": "postgresql://postgres:postgres@postgres:5432/authority" },
        { "name": "AppDB", "type": "postgres", "connection": "postgresql://postgres:postgres@postgres:5432/appdb" }
      ]
  depends_on:
    postgres:
      condition: service_healthy
```

## App Service Templates

### AppSDK Service

```yaml
{app_name}:
  build:
    context: apps/{app_name}
  depends_on:
    engine:
      condition: service_healthy
    authority:
      condition: service_healthy
  ports:
    - "${APP_PORT:-3000}:3000"
  environment:
    - PROCESSCUBE_ENGINE_URL=http://engine:8000
    - PROCESSCUBE_AUTHORITY_URL=http://authority:11560
    - PROCESSCUBE_EXTERNAL_TASK_WORKER_CLIENT_ID=external_task_worker
    - PROCESSCUBE_EXTERNAL_TASK_WORKER_CLIENT_SECRET=external_task_worker_secret
```

### LowCode Service

```yaml
{app_name}:
  image: {app_name}_image:latest
  build:
    context: apps/{app_name}
  depends_on:
    engine:
      condition: service_healthy
    authority:
      condition: service_healthy
  ports:
    - "1880:1880"
    - 9229:9229
  environment:
    - TZ=Europe/Berlin
    - NODE_ENV=development
    - NODE_OPTIONS=--inspect=0.0.0.0:9229 --enable-source-maps
    - NODERED_AUTHORITY_URL=http://authority:11560
    - NODERED_CLIENT_ID=NodeRedEditorClient
    - NODERED_CLIENT_SECRET=NodeRedEditorSecret
    - NODERED_BASE_URL=http://localhost:1880
    - NODERED_PORT=1880
    - ENGINE_URL=http://engine:8000
    - NODERED_FLOW_STORAGE_OUTPUT_FORMAT=yaml
  volumes:
    - ./apps/{app_name}/data:/data
    - ./apps/{app_name}:/lowcode
```

## Authority Config

The authority config at `.processcube/authority/config/config.json` must include
an `externalTaskWorkers` entry for AppSDK apps:

```json
"externalTaskWorkers": [
  {
    "clientId": "external_task_worker",
    "clientSecret": "external_task_worker_secret",
    "scope": "engine_etw engine_read engine_write"
  }
]
```

This is already present in the AppTemplate.
