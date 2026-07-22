import './App.css'
import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient, InMemoryCache, HttpLink} from '@apollo/client';
import UserAccountListing from './components/users/UserAccountListing';


function App() { 
    const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: import.meta.env.VITE_GRAPHQL_API_URL || "http://localhost:4000/graphql"
        })
    });

  
    return (
        <ApolloProvider client={client}>
            <div className="App">
                <UserAccountListing/>
            </div>
        </ApolloProvider>
    );
}

export default App
