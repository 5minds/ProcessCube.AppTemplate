module.exports = function(RED) {
  function ThermoNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const group = RED.nodes.getNode(config.group);
    if (!group || !group.register) {
      node.warn("Group not found or dashboard-2 group node missing");
      return;
    }

    const min = Number(config.min ?? -50);
    const max = Number(config.max ?? 150);

    const evts = {
      onChange: async function(lastMsg, value) {
        const v = Number(value);
        const clamped = Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : null;
        const msg = lastMsg || {};
        msg.payload = clamped;
        msg.topic = config.topic || msg.topic || "thermo/change";
        node.status({ fill: "green", shape: "ring", text: `Temp: ${clamped}°C` });
        node.send(msg);
      },
      onInput: function(msg, send) {
        const v = Number(msg.payload);
        if (!Number.isFinite(v)) {
          node.status({ fill: "yellow", shape: "ring", text: "non-numeric payload" });
          return;
        }
        const clamped = Math.min(max, Math.max(min, v));
        msg.payload = clamped;
        msg.topic = config.topic || msg.topic || "thermo/input";
        node.status({ fill: "blue", shape: "dot", text: `Input: ${clamped}°C` });
        send(msg);
      },
      onError: function(err) {
        node.error(err);
      }
    };

    group.register(node, config, evts);
  }

  RED.nodes.registerType("ui-thermo", ThermoNode);
}
