
module.exports = function (RED) {

    const url = "/sample_plugin";

    RED.log.info(`Sample plugin works @ ${url}`);

    RED.httpNode.use((req, res, next) => {

        if (req.path === url) {

            setTimeout(() => {
                res.status(200).json({ status: "sample plugin" });
            }, 10);

        } else {
            next();
        }
    });
};