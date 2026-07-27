import './App.css'

import {
    ApolloClient,
    ApolloLink,
    HttpLink,
    InMemoryCache,  
} from '@apollo/client';

import {
    createClient,
} from "graphql-ws";

import { 
    ApolloProvider 
} from '@apollo/client/react';

import {
    GraphQLWsLink,
} from "@apollo/client/link/subscriptions";

import {
    OperationTypeNode,
} from "graphql";

import AppRoutes from "./routes";

const graphqlHttpUrl =
    import.meta.env.VITE_GRAPHQL_API_URL ||
    "http://localhost:4000/graphql";

const graphqlWebSocketUrl =
    import.meta.env.VITE_GRAPHQL_WS_URL ||
    "ws://localhost:4000/graphql";

const httpLink = new HttpLink({
    uri: graphqlHttpUrl
});

const webSocketLink = new GraphQLWsLink(
    createClient({
        url: graphqlWebSocketUrl,
        lazy: true,
    })
);

const splitLink = ApolloLink.split(
    ({ operationType }) =>
        operationType === OperationTypeNode.SUBSCRIPTION,

    webSocketLink,
    httpLink
);

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
});

function App() { 
    return (
        <ApolloProvider client={client}>
            <AppRoutes />
        </ApolloProvider>
    );
}

export default App
