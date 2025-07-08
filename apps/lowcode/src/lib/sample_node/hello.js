module.exports = function (RED) {
    function HelloNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function (msg) {

            const greeting = RED.util.evaluateNodeProperty(config.greeting, config.greeting_type, node, msg);

            msg.payload = {
                "greeting_back": `Hello ${greeting || 'World'}!`
            }

            node.send(msg);
        });
    }
    RED.nodes.registerType("hello", HelloNode);
};
