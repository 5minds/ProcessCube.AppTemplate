# PostgreSQL auf ProcessCube.Postgres umbauen

## Aufgaben

- [x] Postgres-Service in docker-compose.yml ersetzen (Image, Volumes, Environment, Healthcheck)
- [x] WhoDB-Service hinzufügen
- [x] Memory-Datei aktualisieren (neue Postgres-Version)

## Review

### Änderungen in `docker-compose.yml`

**Postgres-Service:**
- Image: `postgres:17` → `ghcr.io/processcube-io/processcube.postgres:0.2.1`
- `PGDATA` entfernt (neues Image nutzt Standard-Pfad)
- `INIT_PROCESSCUBE_DBS: "true"` hinzugefügt (erstellt engine, authority, appdb Datenbanken)
- Volume-Mount: `/data/postgres` → `/var/lib/postgresql`
- Healthcheck: `start_period: 30s` hinzugefügt, Intervalle angepasst

**Neuer WhoDB-Service:**
- Web-UI für DB-Verwaltung auf Port 8080 (konfigurierbar via `WHODB_PORT`)
- Vorkonfiguriert mit Verbindungen zu engine, authority und appdb
- Abhängig von gesundem Postgres-Service

### Wichtig vor dem ersten Start
- `rm -rf ./postgres/apptemplate_db.instance` (alte PG17-Daten inkompatibel mit PG18)
