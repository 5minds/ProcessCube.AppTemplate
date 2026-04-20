# LowCode App Template Reference

## Directory Structure

```
apps/{app_name}/
├── src/
│   ├── nodes/
│   │   └── {node_name}/
│   │       ├── {node_name}.js    # Node-RED backend (registers node, External Task)
│   │       └── {node_name}.html  # Node-RED editor UI
│   ├── ui/
│   │   ├── components/           # Vue.js SFC components
│   │   └── exports/              # Vite build entry points
│   ├── package.json              # Node/widget registrations + build scripts
│   ├── custom_settings.js        # Node-RED custom settings (optional)
│   └── vite.config.js            # Vite build config for Vue widgets
├── data/                         # Node-RED data directory (flows, credentials)
├── Dockerfile                    # Based on processcube_lowcode image
└── (no separate package.json at app root — src/package.json is the main one)
```

## Dockerfile

```dockerfile
FROM ghcr.io/5minds/processcube_lowcode:7.9.0

USER root

COPY ./src /package_src/
RUN cd /package_src/ && npm install && npm run build

# Symlink into node_modules (npm install doesn't work with pnpm workspace:*)
RUN PACKAGE_NAME=$(node -e "console.log(require('/package_src/package.json').name)") && \
    SCOPE=$(echo "$PACKAGE_NAME" | grep -o '^@[^/]*' || true) && \
    if [ -n "$SCOPE" ]; then mkdir -p "node_modules/$SCOPE"; fi && \
    ln -s /package_src "node_modules/$PACKAGE_NAME"

USER node-red
```

## src/package.json

```json
{
  "name": "@5minds/node-red-dashboard-2-{app_name}-package",
  "version": "0.0.1",
  "scripts": {
    "build": "echo 'no widgets to build'"
  },
  "node-red": {
    "nodes": {
      "{node_name}": "nodes/{node_name}/{node_name}.js"
    }
  }
}
```

For dashboard widgets, add `node-red-dashboard-2.widgets` section and Vite build scripts.

## External Task Node Pattern

### Backend (nodes/{node_name}/{node_name}.js)

```javascript
module.exports = function(RED) {
  function NodeConstructor(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const engineUrl = process.env.ENGINE_URL || 'http://engine:8000';

    // Register External Task Worker
    const { ExternalTaskWorker } = require('@5minds/processcube_engine_client');
    // ... worker setup
  }
  RED.nodes.registerType('{node_name}', NodeConstructor);
};
```

### Editor UI (nodes/{node_name}/{node_name}.html)

```html
<script type="text/javascript">
  RED.nodes.registerType('{node_name}', {
    category: 'ProcessCube',
    color: '#F8B544',
    defaults: { name: { value: '' } },
    inputs: 1,
    outputs: 1,
    label: function() { return this.name || '{node_name}'; }
  });
</script>
<script type="text/html" data-template-name="{node_name}">
  <div class="form-row">
    <label for="node-input-name"><i class="fa fa-tag"></i> Name</label>
    <input type="text" id="node-input-name" placeholder="Name">
  </div>
</script>
```

## Docker Compose Environment

```yaml
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
```

## Key Conventions

- Dashboard-2 widget packages must be named `node-red-dashboard-2-*`
- Widget architecture: Backend Node.js module + Frontend Vue.js SFC
- Communication via Socket.io events (`widget-action`, `widget-change`)
- Flow storage format is YAML
- Debugging via port 9229 (attach VSCode debugger)
