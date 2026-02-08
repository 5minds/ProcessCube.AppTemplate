# Changelog ProcessCube.AppTemplate

---

## 🔮 In Entwicklung (Ausblick auf nächstes Release)

*Diese Features sind nach v0.10.0-insiders.1 hinzugekommen und werden im nächsten Release enthalten sein.*

*Noch keine neuen Änderungen.*

---

## 🧪 v0.10.0-insiders.1 (08.02.2026)

**Insiders-Vorschauversion** — Für Feedback und Early Testing

### Experimentelle Features
- PostgreSQL-Image auf ProcessCube.Postgres 0.2.1 umgestellt (PostgreSQL 18 mit Extensions: timescaledb, pgvector, pg_search u.a.)
- Automatische Datenbank-Initialisierung für engine, authority und appdb
- WhoDB-Service für Web-basierte Datenbankverwaltung (Port 8080)
- Authority-Healthcheck und korrekte Service-Abhängigkeiten (behebt OpenID-Verbindungsfehler beim Start)

### Weitere Änderungen seit v0.9.4
- Flow-Speicherformat von JSON auf YAML umgestellt
- Parameter zur Dialog-Steuerung hinzugefügt
- Neues ProcessCube.LowCode-Image integriert
- Engine- und Authority-Image-Versionen aktualisiert
- Dockerfile-Build für pnpm-Workspace-Kompatibilität korrigiert

### Bekannte Einschränkungen
- Bestehende PostgreSQL-17-Daten sind nicht kompatibel — `./postgres/apptemplate_db.instance` muss vor dem ersten Start gelöscht werden

---

## ✅ v0.9.4 (31.08.2025)

*Versions-Aktualisierung.*

- Keine funktionalen Änderungen

---

## ✅ v0.9.2 (26.08.2025)

### Technische Änderungen
- PostgreSQL-Datenverzeichnis ins Git-Repository aufgenommen

---

## ✅ v0.9.1 (26.08.2025)

### Technische Änderungen
- README aktualisiert

---

## ✅ v0.9.0 (26.08.2025)

*Erste vollständige Version mit CI/CD-Pipeline und UI-Widgets.*

### Neue Funktionen
- Dashboard-2 UI-Widgets (ui-hello, ui-thermo) mit Vue.js-Komponenten
- Beispiel-Node mit External-Task-Integration zur ProcessCube Engine
- Custom-Plugin für Node-RED (sample_plugin)
- VSCode-Debugging-Unterstützung für Node-RED im Docker-Container
- GitHub-Actions-Workflow zum Bauen und Veröffentlichen des Docker-Images auf GHCR

### Technische Änderungen
- Dynamisches Port-Mapping für PostgreSQL
- LowCode-Image auf Version 7.1.0 aktualisiert
- Authority-Image aktualisiert

---

## ✅ v0.1.0 (07.07.2025)

*Initiale Version des AppTemplates.*

### Neue Funktionen
- ProcessCube LowCode AppTemplate mit Custom-Plugin und Custom-Node
- Docker-Compose-Setup mit Engine, Authority, PostgreSQL und LowCode
- Debugging-Konfiguration für VSCode

---

## Release-Prozess

Features durchlaufen drei Phasen, bevor sie alle Nutzer erreichen:

```
🔮 In Entwicklung  →  🧪 Insiders  →  ✅ Stable
     (Ausblick)        (Early Adopter)    (Alle Nutzer)
```

| Phase | Zielgruppe | Beschreibung |
|-------|------------|--------------|
| 🔮 **In Entwicklung** | Entwickler | Ausblick auf kommende Features. Noch in keinem Release enthalten. |
| 🧪 **Insiders** | Early Adopter | Vorschau-Versionen zum Testen neuer Features vor dem Stable-Release. |
| ✅ **Stable** | Alle Nutzer | Produktionsreife Version. Features sind vollständig getestet und freigegeben. |

**Hinweis:** Jeder Abschnitt listet nur die Änderungen, die **neu** in dieser Phase sind.