const express = require("express");

function startHttpServer(port = process.env.PORT || 10000) {
    const app = express();

    // TODO: This HTTP endpoint was added purely so Render can treat this process
    // as a Web Service. Remove this if/when the consumer is deployed as a true
    // Background Worker.
    app.get("/", (req, res) => {
        res.send("ResolveIQ consumer is running.");
    });

    // TODO: This HTTP listener was added purely for the Render Web Service
    // workaround. Remove this if/when the consumer runs as a proper Background Worker.
    app.listen(port, "0.0.0.0", () => {
        console.log(`HTTP server listening on port ${port}`);
    });
}

module.exports = { startHttpServer };