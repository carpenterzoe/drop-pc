import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: '//localhost:3000/graphql',
  cache: new InMemoryCache(),
});
