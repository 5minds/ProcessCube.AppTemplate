# ProcessCube.AppTemplate

Hier werden folgende Dinge gezeigt:

- Debugging von Lowcode Apps mit
  - plugin: apps/lowcode/src/lib/aplugin/*
  - plugin: apps/lowcode/src/lib/sample_node

![Hello Node](./.assets/hello_node.png)

Im ersten Schritt stellen wir diese Beispiel für die Entwicklung von Custom-Plugins und -Node
mittels JavaScript vor. Diese können dann in Lowcode Apps verwendet werden.

Optionen für das Debugging:
- Attach to Node-RED: https://github.com/5minds/ProcessCube.AppTemplate/blob/main/docker-compose.yml#L72
- Breakpoint direkt beim Start, Node-RED bleibt stehen bis der Debugger verbunden ist: https://github.com/5minds/ProcessCube.AppTemplate/blob/main/docker-compose.yml#L75

Danach einfach per VSCode --> Debugging --> Attach to Node-RED

TBD: TypeScript Version

Was ist noch enthalten:
- Engine mit Anbindung an Postgres
- Authority
- Postgres mit Init-Script
