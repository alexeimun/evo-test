import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';


const { NODE_ENV, REACT_APP_GRAPHQL_URI } = process.env;

const isNotProduction = NODE_ENV !== 'production';
const uri = isNotProduction ? 'http://localhost:3001/graphql' : REACT_APP_GRAPHQL_URI;

// Log
console.log('\nNODE_ENV', NODE_ENV, '\nGRAPHQL_URI', uri);

const httpLink = createHttpLink({ uri });

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('x-auth-token');
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
