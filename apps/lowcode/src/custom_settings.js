
const config = {
    editorTheme: {
        header: {
            title: "LowCode AppTemplate"
        },
        palette: {
            categories: [
                "ProcessCube Samples",
            ]
        },
        other: {
            settings: "settings"
        },
        functionGlobalContext: {
            "os": require('os')
        }
    }
};

module.exports = config;