const { ApolloServer } = require("@apollo/server");
const {
    startStandaloneServer,
} = require("@apollo/server/standalone");

const {
    typeDefs,
    resolvers,
} = require("./graphql");

const port = Number(process.env.PORT) || 4000;

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

async function startServer() {
    const { url } = await startStandaloneServer(server, {
        listen: { port },
    });

    console.log(`Your API is running at: ${url}`);
}

startServer();