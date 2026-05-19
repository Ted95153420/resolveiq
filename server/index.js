const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const {typeDefs } = require('./schema/type-defs.js') 
const { resolvers } = require('./schema/resolvers.js');

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

async function startServer() {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
    });

    console.log(`Your API is running at: ${url}`);
}

startServer();