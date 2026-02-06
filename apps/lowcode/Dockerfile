FROM ghcr.io/5minds/processcube_lowcode:7.7.1

# Root Benutzer für die Installation von Systempaketen
USER root

# copy src und npm install für dependencies
COPY ./src /package_src/
# wechsel in das Verzeichnis, in dem die package.json liegt
RUN cd /package_src/ && npm install && npm run build
    
# npm packages in den Suchpfad von Node.js/Node-RED verlinken (Symlink) im Workdir
# Hinweis: "npm install /package_src/" funktioniert nicht, da das Base-Image pnpm workspace:*
# Dependencies in der package.json hat, die npm nicht versteht. Daher manueller Symlink.
RUN PACKAGE_NAME=$(node -e "console.log(require('/package_src/package.json').name)") && \
    SCOPE=$(echo "$PACKAGE_NAME" | grep -o '^@[^/]*' || true) && \
    if [ -n "$SCOPE" ]; then mkdir -p "node_modules/$SCOPE"; fi && \
    ln -s /package_src "node_modules/$PACKAGE_NAME"

# node-red ist der Benutzer unter dem Node-RED läuft
USER node-red

