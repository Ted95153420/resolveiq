import './App.css'
import { ApolloProvider } from '@apollo/client/react';
import {ApolloClient, InMemoryCache, HttpLink} from '@apollo/client' 


function App() { 
    const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({ uri: "http://localhost:4000/graphql" })
    });

  return (
      <ApolloProvider client={client}>
        <div>hello world</div>  
    </ApolloProvider>
  )
}

export default App
