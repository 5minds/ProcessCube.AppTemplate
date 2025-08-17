# node-red-dashboard-2-ui-multi-wired

Two Dashboard 2 widgets in one package with full wiring.

- ui-hello: emits messages on button click via widget-action.
- ui-thermo: supports input msgs (onInput) and user changes (onChange).

Build:
  npm i
  npm run build

Install into Node-RED:
  npm i /path/to/node-red-dashboard-2-ui-multi-wired
  Restart Node-RED.

Then add a Dashboard 2 page/group and drop the nodes ui-hello and ui-thermo.
