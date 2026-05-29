import './App.css'
import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient, InMemoryCache, HttpLink} from '@apollo/client';
import DisplayData from './RetrieveUserData';


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
                <h1>List Of Loyalty Customers</h1>
                <DisplayData/>
            </div>
        </ApolloProvider>
    );
}

export default App
