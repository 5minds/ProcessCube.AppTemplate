module.exports = function (RED) {
    function FormContext(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        // Initialisiere den Kontext-Speicher
        // Struktur: { clientId: { topic: payload } } oder { topic: payload } wenn useClientContext false
        node.context().set('formData', {});

        node.on('input', function (msg) {
            const useClientContext = config.useClientContext || false;
            const clientId = msg._client || 'default';
            
            // Hole den aktuellen Speicher
            let formData = node.context().get('formData') || {};

            // Prüfe ob es eine Action ist
            if (msg.topic === 'action') {
                const action = msg.payload;

                // action == clear ist vordefiniert 
                if (action === 'clear') {

                    // Lösche Daten für den spezifischen Client oder alle
                    if (useClientContext) {
                        delete formData[clientId];
                        node.status({ fill: 'blue', shape: 'ring', text: `Cleared for client: ${clientId}` });
                    } else {
                        formData = {};
                        node.status({ fill: 'blue', shape: 'ring', text: 'Cleared all data' });
                    }
                    node.context().set('formData', formData);
                    return; // Keine Ausgabe bei clear

                } else {
                    // alle anderen Actions: sende die Daten
                    // Sende gespeicherte Daten
                    let dataToSend;
                    if (useClientContext) {
                        dataToSend = formData[clientId] || {};
                        node.status({ fill: 'green', shape: 'dot', text: `Sent for client: ${clientId}` });
                    } else {
                        dataToSend = formData;
                        node.status({ fill: 'green', shape: 'dot', text: 'Sent all data' });
                    }
                    
                    // Action in die gesendeten Daten einfügen
                    dataToSend['action'] = action;

                    const outputMsg = {
                        ...msg,
                        payload: dataToSend,
                        topic: 'formData'
                    };
                    node.send(outputMsg);
                    return;
                }
            }

            // Normaler Speicher-Modus: Speichere topic -> payload
            if (msg.topic && msg.topic !== 'action') {
                if (useClientContext) {
                    // Speichere pro Client
                    if (!formData[clientId]) {
                        formData[clientId] = {};
                    }
                    formData[clientId][msg.topic] = msg.payload;
                    node.status({ fill: 'yellow', shape: 'dot', text: `Stored: ${msg.topic} (${clientId})` });
                } else {
                    // Speichere global
                    formData[msg.topic] = msg.payload;
                    node.status({ fill: 'yellow', shape: 'dot', text: `Stored: ${msg.topic}` });
                }
                node.context().set('formData', formData);
            }
        });

        // Cleanup beim Schließen
        node.on('close', function () {
            node.context().set('formData', {});
        });
    }
    RED.nodes.registerType("form_context", FormContext);
};
