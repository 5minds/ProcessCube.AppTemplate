module.exports = function(RED) {
  function HelloNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const group = RED.nodes.getNode(config.group);
    if (!group || !group.register) {
      node.warn("Group not found or dashboard-2 group node missing");
      return;
    }

    const evts = {
      onAction: true,
      beforeSend: function(msg) {
        if (config.topic) msg.topic = config.topic;
        msg.widget = "ui-hello";
        return msg;
      },
      onInput: function(msg, send) {
        if (typeof msg.payload === "string") {
          node.status({ fill: "blue", shape: "dot", text: msg.payload });
        }
        send(msg);
      },
      onError: function(err) {
        node.error(err);
      }
    };

    group.register(node, config, evts);
  }

  RED.nodes.registerType("ui-hello", HelloNode);
}
