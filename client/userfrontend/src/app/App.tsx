import './App.css'

import {
    ApolloClient,
    InMemoryCache,
    HttpLink
} from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

import AppRoutes from "./routes";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: import.meta.env.VITE_GRAPHQL_API_URL || "http://localhost:4000/graphql"
    })
});

function App() { 
    return (
        <ApolloProvider client={client}>
            <AppRoutes />
        </ApolloProvider>
    );
}

export default App
