
const config = {
    editorTheme: {
        header: {
            title: "LowCode AppTemplate"
        },
        palette: {
            categories: [
                "MyProject",
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