const express = require("express");
const cors = require("cors");
const http = require("http");

const {
    ApolloServer,
} = require("@apollo/server");

const {
    ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");

const {
    expressMiddleware,
} = require("@as-integrations/express5");

const {
    schema,
} = require("./graphql");

const port = Number(process.env.PORT) || 4000;

async function startServer() {
    const app = express();

    /*
     * This is a standard Node HTTP server wrapping
     * the Express application.
     */
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        schema,

        plugins: [
            ApolloServerPluginDrainHttpServer({
                httpServer,
            }),
        ],
    });

    /*
     * Apollo must be started before it is passed
     * to expressMiddleware.
     */
    await server.start();

    app.use(
        "/graphql",
        cors(),
        express.json(),
        expressMiddleware(server)
    );

    await new Promise((resolve) => {
        httpServer.listen(
            {
                port,
            },
            resolve
        );
    });

    console.log(
        `GraphQL API running at http://localhost:${port}/graphql`
    );
}

startServer().catch((error) => {
    console.error(
        "Failed to start GraphQL API:",
        error
    );

    process.exit(1);
});