const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const {typeDefs } = require('./graphql/schema/type-defs.js') 
const { resolvers } = require('./graphql/schema/resolvers.js');

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const port = process.env.PORT || 4000;

async function startServer() {
    const { url } = await startStandaloneServer(server, {
        listen: { port },
    });

    console.log(`Your API is running at: ${url}`);
}

startServer();